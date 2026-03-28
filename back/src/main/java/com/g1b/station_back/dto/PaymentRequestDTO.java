package com.g1b.station_back.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PaymentRequestDTO(
        @NotNull(message = "Transaction ID cannot be null")
        Integer transactionId,
        @NotBlank(message = "Payment method cannot be blank")
        String paymentMethod,
        @NotNull(message = "Payment amount cannot be null")
        BigDecimal amount,
        String endNumCard,
        Integer id_cce_card
) {}
