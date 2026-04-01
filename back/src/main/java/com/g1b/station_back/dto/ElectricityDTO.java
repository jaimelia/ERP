package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record ElectricityDTO(Integer id, String name, BigDecimal normalPrice, BigDecimal fastPrice) implements ItemIDTO {
}
