package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record TransactionPaymentDTO(
        Integer idTransactionPayment,
        String paymentMethod,
        BigDecimal amount,
        String endNumCard,
        String status,
        String date,
        Integer idCceCard
) {}
