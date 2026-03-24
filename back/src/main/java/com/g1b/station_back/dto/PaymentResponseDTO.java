package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record PaymentResponseDTO(
        PaymentStatus status,
        BigDecimal amountRemaining,
        String message
) {}
