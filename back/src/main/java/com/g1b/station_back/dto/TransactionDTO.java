package com.g1b.station_back.dto;

import java.util.List;

public record TransactionDTO(
        Integer idTransaction,
        String type,
        String transactionDate,
        Boolean isFromAutomat,
        String status,
        List<TransactionLineDTO> lines,
        List<TransactionPaymentDTO> payments
) {}
