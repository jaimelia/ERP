package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record RestockableItemDTO(Integer id, String name, BigDecimal price, BigDecimal quantity, String itemType, BigDecimal alertThreshold, BigDecimal autoRestockQuantity) {
}
