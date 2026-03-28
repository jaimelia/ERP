package com.g1b.station_back.dto;

import com.g1b.station_back.model.enums.PumpChargerStatus;

import java.time.LocalDateTime;
import java.util.List;

public record PumpDTO(
        Integer id,
        Boolean isAutomate,
        PumpChargerStatus status,
        Boolean enabled,
        LocalDateTime inUseAt,
        List<FuelLevelDTO> fuelLevels
) {}
