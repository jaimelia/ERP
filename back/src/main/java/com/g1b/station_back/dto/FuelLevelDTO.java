package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record FuelLevelDTO(
        String type,
        BigDecimal currentLevel,
        BigDecimal maxLevel
) {}
