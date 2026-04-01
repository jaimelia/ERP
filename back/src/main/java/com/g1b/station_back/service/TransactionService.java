package com.g1b.station_back.service;

import com.g1b.station_back.dto.*;
import com.g1b.station_back.model.Item;
import com.g1b.station_back.model.Transaction;
import com.g1b.station_back.model.TransactionLine;
import com.g1b.station_back.model.TransactionPayment;
import com.g1b.station_back.model.enums.TransactionStatus;
import com.g1b.station_back.repository.TransactionRepository;
import com.g1b.station_back.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final ItemService itemService;
    private final UserRepository userRepository;


    public TransactionService(TransactionRepository transactionRepository, ItemService itemService, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.itemService = itemService;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAllByOrderByTransactionDateDesc();

        return transactions.stream()
                .map(this::mapToTransactionDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getMyTransactions(String username) {
        return transactionRepository.findAllByUser_UsernameOrderByTransactionDateDesc(username)
                .stream()
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
            Item item = line.getItem();
            
            BigDecimal price = BigDecimal.ZERO;
            if (item.getPrices() != null && !item.getPrices().isEmpty()) {
                price = item.getPrices().getFirst().getPrice(); // Use the first available price for the DTO
            }

            itemDTO = new TransactionItemDTO(
                    item.getIdItem(),
                    item.getName(),
                    price,
                    item.getStock(),
                    item.getType() != null ? item.getType().getName() : null
            );
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
    public Integer createShopTransaction(TransactionCreationRequestDTO requestDTO, String username) {
        Transaction newTransaction = new Transaction();
        newTransaction.setType(requestDTO.type());
        newTransaction.setIsFromAutomat(requestDTO.isFromAutomat());
        newTransaction.setTransactionDate(LocalDateTime.now());
        newTransaction.setStatus(TransactionStatus.inProgress);
        userRepository.findByUsername(username).ifPresent(newTransaction::setUser);

        Set<TransactionLine> transactionLines = new HashSet<>();
        for (TransactionLineRequestDTO lineDTO : requestDTO.lines()) {
            ItemDTO itemDTO = itemService.getItemById(lineDTO.idItem());
            if (itemDTO == null) {
                throw new IllegalArgumentException("Item with ID " + lineDTO.idItem() + " not found");
            }
            if (itemDTO.getStock() != null && itemDTO.getStock().compareTo(new BigDecimal(lineDTO.quantity())) >= 0) {
                TransactionLine transactionLine = new TransactionLine();
                Item item = new Item();
                item.setIdItem(itemDTO.getIdItem());
                item.setName(itemDTO.getName());
                // In a real scenario, you'd fetch the entity from the repo to attach it
                // We're adapting this briefly to compile, ideally itemService would return the entity or we fetch it here.
                // Let's assume we have to use the ID.
                transactionLine.setItem(item);
                transactionLine.setQuantity(lineDTO.quantity());
                
                BigDecimal newStock = itemDTO.getStock().subtract(new BigDecimal(lineDTO.quantity()));
                itemDTO.setStock(newStock);
                itemService.updateItem(itemDTO.getIdItem(), itemDTO); // update stock

                transactionLine.setTransaction(newTransaction);
                
                BigDecimal price = BigDecimal.ZERO;
                if (itemDTO.getPrices() != null && !itemDTO.getPrices().isEmpty()) {
                    price = itemDTO.getPrices().getFirst().getPrice();
                }
                
                transactionLine.setTotalAmount(price.multiply(new BigDecimal(lineDTO.quantity())));

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
            if (line.getItem() != null) {
                ItemDTO itemDTO = itemService.getItemById(line.getItem().getIdItem());
                if (itemDTO != null && itemDTO.getStock() != null) {
                    BigDecimal newStock = itemDTO.getStock().add(new BigDecimal(line.getQuantity()));
                    itemDTO.setStock(newStock);
                    itemService.updateItem(itemDTO.getIdItem(), itemDTO);
                }
            }
        }
        transaction.setStatus(TransactionStatus.canceled);
        transactionRepository.save(transaction);
        return transactionId;
    }
}
