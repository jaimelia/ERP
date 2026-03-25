package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record ItemDTO(Integer id, String name, BigDecimal quantity, BigDecimal price, String itemType) {
}
