package com.g1b.station_back.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.g1b.station_back.model.enums.DocumentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DailyTransactionsReportDTO(
        Integer id,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        LocalDate reportDate,
        List<FuelReportLineDTO> fuelLines,
        BigDecimal totalFuelVolume,
        BigDecimal totalElectricityVolume,
        BigDecimal totalElectricityAmount,
        BigDecimal totalProductVolume,
        BigDecimal totalProductsAmount,
        Integer automatTransactionCount,
        Integer cashierTransactionCount,
        Integer transactionCount,
        BigDecimal totalFuelsAmount,
        BigDecimal totalAmount,
        DocumentStatus status
) {}
