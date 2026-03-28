package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record TransactionLineDTO(
        Integer idTransactionLine,
        Integer quantity,
        BigDecimal totalAmount,
        ItemIDTO item
) {}
