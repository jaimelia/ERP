package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record PaymentResponseDTO(
        Integer paymentId,
        PaymentStatus status,
        BigDecimal amountRemaining,
        String message
) {
    public enum PaymentStatus {
        VALIDATED,
        PARTIAL,
        EXCESS,
        CANCELED
    }
}
