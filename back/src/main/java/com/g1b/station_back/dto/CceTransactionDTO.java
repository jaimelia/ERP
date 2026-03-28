package com.g1b.station_back.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CceTransactionDTO(Integer idTransaction, String type, LocalDate date, BigDecimal amount) {}