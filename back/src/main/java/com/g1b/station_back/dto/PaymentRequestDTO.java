package com.g1b.station_back.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record PaymentRequestDTO(
        @NotBlank(message = "Transaction ID cannot be blank")
        Integer transactionId,
        @NotBlank(message = "Payment method cannot be blank")
        String paymentMethod,
        @NotBlank(message = "Payment amount cannot be blank")
        BigDecimal amount,
        String endNumCard,
        Integer id_cce_card
) {}
