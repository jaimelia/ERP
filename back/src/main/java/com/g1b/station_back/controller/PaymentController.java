package com.g1b.station_back.controller;

import com.g1b.station_back.dto.PaymentRequestDTO;
import com.g1b.station_back.dto.PaymentResponseDTO;
import com.g1b.station_back.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/process")
    public ResponseEntity<PaymentResponseDTO> processPayment(@Valid @RequestBody PaymentRequestDTO paymentRequestDTO) {
        return org.springframework.http.ResponseEntity.ok(paymentService.handlePaymentRequest(paymentRequestDTO));
    }

    @PostMapping("/cancel/{paymentId}")
    public ResponseEntity<Integer> cancelPayment(@PathVariable Integer paymentId) {
        return ResponseEntity.ok(paymentService.cancelPayment(paymentId));
    }

}
