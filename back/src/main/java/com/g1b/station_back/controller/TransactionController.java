package com.g1b.station_back.controller;

import com.g1b.station_back.dto.TransactionCreationRequestDTO;
import com.g1b.station_back.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/shop")
    public ResponseEntity<Integer> createShopTransaction(@Valid @RequestBody TransactionCreationRequestDTO requestDTO) {
        Integer transactionId = transactionService.createShopTransaction(requestDTO);
        return new ResponseEntity<>(transactionId, HttpStatus.CREATED);
    }

    @PostMapping("/shop/cancel/{transactionId}")
    public ResponseEntity<Integer> cancelShopTransaction(@PathVariable Integer transactionId) {
        return ResponseEntity.ok(transactionService.cancelShopTransaction(transactionId));
    }

}
