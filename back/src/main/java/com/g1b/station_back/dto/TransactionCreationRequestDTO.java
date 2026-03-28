package com.g1b.station_back.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record TransactionCreationRequestDTO(
        @NotBlank(message = "Transaction type cannot be blank")
        String type,
        @NotNull(message = "isFromAutomat cannot be null")
        Boolean isFromAutomat,
        @NotNull(message = "Transaction lines cannot be null")
        @Size(min = 1, message = "Transaction must have at least one line item")
        List<@Valid TransactionLineRequestDTO> lines
) {}