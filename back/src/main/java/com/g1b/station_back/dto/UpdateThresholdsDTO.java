package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record UpdateThresholdsDTO(Integer idItem, BigDecimal alertThreshold, BigDecimal autoRestockQuantity) {
}
