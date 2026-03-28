package com.g1b.station_back.controller;

import com.g1b.station_back.dto.EvChargerDTO;
import com.g1b.station_back.service.EvChargerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping("/api/chargers")
public class EvChargerController {
	private final EvChargerService evChargerService;

	public EvChargerController(EvChargerService evChargerService) {
		this.evChargerService = evChargerService;
	}

	@GetMapping
	public ResponseEntity<List<EvChargerDTO>> getAllChargers() {
		return ResponseEntity.ok(evChargerService.getAllChargers());
	}
}
