package com.g1b.station_back.dto;

import com.g1b.station_back.model.enums.RestockStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RestockDTO(Integer id, String itemName, BigDecimal quantity, RestockStatus status, LocalDate date, String itemType) {
}
