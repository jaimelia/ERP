package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record FuelReportLineDTO(
        String fuelName,
        Integer volumeDelivered,
        BigDecimal pricePerLiter,
        BigDecimal totalAmount
) {}
