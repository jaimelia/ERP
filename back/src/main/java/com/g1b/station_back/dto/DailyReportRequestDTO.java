package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record DailyReportRequestDTO(
        String reportDate,
        BigDecimal totalFuelVolume,
        BigDecimal totalFuelsAmount,
        BigDecimal totalElectricityVolume,
        BigDecimal totalElectricityAmount,
        BigDecimal totalProductVolume,
        BigDecimal totalProductsAmount,
        Integer automatTransactionCount,
        Integer cashierTransactionCount
) {}
