package com.g1b.station_back.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.g1b.station_back.model.enums.DocumentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyReportSummaryDTO(
        Integer id,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        LocalDate reportDate,
        Integer transactionCount,
        BigDecimal totalAmount,
        DocumentStatus status
) {}
