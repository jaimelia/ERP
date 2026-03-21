package com.g1b.station_back.service;

import com.g1b.station_back.dto.TransactionCreationRequestDTO;
import com.g1b.station_back.dto.TransactionLineRequestDTO;
import com.g1b.station_back.model.Product;
import com.g1b.station_back.model.Transaction;
import com.g1b.station_back.model.TransactionLine;
import com.g1b.station_back.model.enums.TransactionStatus;
import com.g1b.station_back.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final ProductService productService;


    public TransactionService(TransactionRepository transactionRepository, ProductService productService) {
        this.transactionRepository = transactionRepository;
        this.productService = productService;
    }


    @Transactional
    public Integer createShopTransaction(TransactionCreationRequestDTO requestDTO) {
        Transaction newTransaction = new Transaction();
        newTransaction.setType(requestDTO.type());
        newTransaction.setIsFromAutomat(requestDTO.isFromAutomat());
        newTransaction.setTransactionDate(LocalDate.now());
        newTransaction.setStatus(TransactionStatus.inProgress);

        List<TransactionLine> transactionLines = new ArrayList<>();
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
                throw new IllegalArgumentException("Not enough stock for product " + product.getName());
            }
        }
        newTransaction.setLines(transactionLines);

        transactionRepository.save(newTransaction);
        return newTransaction.getIdTransaction();
    }
}
