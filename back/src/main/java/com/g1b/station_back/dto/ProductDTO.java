package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record ProductDTO(
        Integer idItem,
        String name,
        BigDecimal unitPrice,
        Integer stock,
        Integer alertThreshold
) implements ItemIDTO {
}
