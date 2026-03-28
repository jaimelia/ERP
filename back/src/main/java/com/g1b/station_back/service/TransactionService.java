package com.g1b.station_back.service;

import com.g1b.station_back.dto.*;
import com.g1b.station_back.model.*;
import com.g1b.station_back.model.enums.TransactionStatus;
import com.g1b.station_back.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final ProductService productService;


    public TransactionService(TransactionRepository transactionRepository, ProductService productService) {
        this.transactionRepository = transactionRepository;
        this.productService = productService;
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAllByOrderByTransactionDateDesc();

        return transactions.stream()
                .map(this::mapToTransactionDTO)
                .collect(Collectors.toList());
    }

    private TransactionDTO mapToTransactionDTO(Transaction transaction) {
        List<TransactionLineDTO> linesDTO = transaction.getLines().stream()
                .map(this::mapToTransactionLineDTO)
                .collect(Collectors.toList());

        List<TransactionPaymentDTO> paymentsDTO = transaction.getPayments().stream()
                .map(this::mapToTransactionPaymentDTO)
                .collect(Collectors.toList());

        return new TransactionDTO(
                transaction.getIdTransaction(),
                transaction.getType() != null ? transaction.getType() : null,
                transaction.getTransactionDate() != null ? transaction.getTransactionDate().toString() : null,
                transaction.getIsFromAutomat(),
                transaction.getStatus() != null ? transaction.getStatus().name() : null,
                linesDTO,
                paymentsDTO
        );
    }

    private TransactionLineDTO mapToTransactionLineDTO(TransactionLine line) {
        ItemIDTO itemDTO = null;

        if (line.getItem() != null) {
            var item = line.getItem();

            // Vérification du type d'Item et mapping vers le DTO spécifique
            if (item instanceof Product p) {
                itemDTO = new ProductDTO(
                        p.getIdItem(),
                        p.getName(),
                        p.getUnitPrice(),
                        p.getStock(),
                        p.getAlertThreshold()
                );
            } else if (item instanceof Fuel f) {
                itemDTO = new FuelDTO(
                        f.getIdItem(),
                        f.getName(),
                        f.getPricePerLiter(),
                        f.getStock()
                );
            } else if (item instanceof Electricity e) {
                itemDTO = new ElectricityDTO(
                        e.getIdItem(),
                        e.getName(),
                        e.getNormalPrice(),
                        e.getFastPrice()
                );
            }
        }

        return new TransactionLineDTO(
                line.getIdTransactionLine(),
                line.getQuantity(),
                line.getTotalAmount(),
                itemDTO
        );
    }

    private TransactionPaymentDTO mapToTransactionPaymentDTO(TransactionPayment payment) {
        Integer idCceCard = (payment.getCceCard() != null) ? payment.getCceCard().getIdCceCard() : null;

        return new TransactionPaymentDTO(
                payment.getIdTransactionPayment(),
                payment.getPaymentMethod() != null ? payment.getPaymentMethod().name() : null,
                payment.getAmount(),
                payment.getEndNumCard(),
                payment.getStatus() != null ? payment.getStatus().name() : null,
                payment.getDate() != null ? payment.getDate().toString() : null,
                idCceCard
        );
    }

    @Transactional
    public Integer createShopTransaction(TransactionCreationRequestDTO requestDTO) {
        Transaction newTransaction = new Transaction();
        newTransaction.setType(requestDTO.type());
        newTransaction.setIsFromAutomat(requestDTO.isFromAutomat());
        newTransaction.setTransactionDate(LocalDate.now());
        newTransaction.setStatus(TransactionStatus.inProgress);

        Set<TransactionLine> transactionLines = new HashSet<>();
        for (TransactionLineRequestDTO lineDTO : requestDTO.lines()) {
            Product product = productService.getProductById(lineDTO.idItem());
            if (product == null) {
                throw new IllegalArgumentException("Product with ID " + lineDTO.idItem() + " not found");
            }
            if (product.getStock() >= lineDTO.quantity()) {
                TransactionLine transactionLine = new TransactionLine();
                transactionLine.setItem(product);
                transactionLine.setQuantity(lineDTO.quantity());
                product.setStock(product.getStock() - lineDTO.quantity());
                transactionLine.setTransaction(newTransaction);
                transactionLine.setTotalAmount(product.getUnitPrice().multiply(new BigDecimal(lineDTO.quantity())));

                transactionLines.add(transactionLine);
            } else {
                return -1;
            }
        }
        newTransaction.setLines(transactionLines);

        transactionRepository.save(newTransaction);
        return newTransaction.getIdTransaction();
    }

    @Transactional
    public Integer cancelShopTransaction(Integer transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
        if (transaction.getStatus() == TransactionStatus.canceled) {
            return transactionId;
        }
        for (TransactionLine line : transaction.getLines()) {
            if (line.getItem() instanceof Product product) {
                product.setStock(product.getStock() + line.getQuantity());
            }
        }
        transaction.setStatus(TransactionStatus.canceled);
        transactionRepository.save(transaction);
        return transactionId;
    }
}
