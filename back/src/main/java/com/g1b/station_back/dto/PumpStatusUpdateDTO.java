package com.g1b.station_back.dto;

import com.g1b.station_back.model.enums.PumpChargerStatus;

public record PumpStatusUpdateDTO(PumpChargerStatus status) {}
