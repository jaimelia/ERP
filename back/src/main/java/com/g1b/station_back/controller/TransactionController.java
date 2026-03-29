package com.g1b.station_back.controller;

import com.g1b.station_back.dto.TransactionCreationRequestDTO;
import com.g1b.station_back.dto.TransactionDTO;
import com.g1b.station_back.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
	@PreAuthorize("hasAuthority('READ_TRANSACTIONS')")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @PostMapping("/shop")
	@PreAuthorize("hasAuthority('CREATE_TRANSACTIONS')")
    public ResponseEntity<Integer> createShopTransaction(@Valid @RequestBody TransactionCreationRequestDTO requestDTO) {
        Integer transactionId = transactionService.createShopTransaction(requestDTO);
        return new ResponseEntity<>(transactionId, HttpStatus.CREATED);
    }

    @PostMapping("/shop/cancel/{transactionId}")
	@PreAuthorize("hasAuthority('CANCEL_TRANSACTIONS')")
    public ResponseEntity<Integer> cancelShopTransaction(@PathVariable Integer transactionId) {
        return ResponseEntity.ok(transactionService.cancelShopTransaction(transactionId));
    }

}
