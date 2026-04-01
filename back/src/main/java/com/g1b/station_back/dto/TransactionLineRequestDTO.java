package com.g1b.station_back.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record TransactionLineRequestDTO(
        @NotNull(message = "Item ID cannot be null")
        Integer idItem,
        @NotNull(message = "Quantity cannot be null")
        @Min(value = 1, message = "Quantity must be at least 1")
        Integer quantity
) {}