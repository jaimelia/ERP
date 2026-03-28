package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record ProductDTO(Integer idItem, String name, BigDecimal price, Integer stock) {
}
