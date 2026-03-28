package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record FuelDTO(Integer idItem, String name, BigDecimal price, BigDecimal stock) implements ItemIDTO {
}
