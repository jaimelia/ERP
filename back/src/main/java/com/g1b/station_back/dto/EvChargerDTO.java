package com.g1b.station_back.dto;

import com.g1b.station_back.model.enums.PumpChargerStatus;

public record EvChargerDTO(
		Integer idEvCharger,
		Boolean isFast,
		PumpChargerStatus status
) {}