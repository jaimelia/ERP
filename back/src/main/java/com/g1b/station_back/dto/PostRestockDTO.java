package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record PostRestockDTO(Integer idItem, BigDecimal quantity) {
}
