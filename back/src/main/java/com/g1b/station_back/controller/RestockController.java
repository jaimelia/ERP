package com.g1b.station_back.controller;

import com.g1b.station_back.dto.RestockDTO;
import com.g1b.station_back.service.RestockService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping("/api/restocks")
public class RestockController {
	private final RestockService restockService;

	public RestockController(RestockService restockService) {
		this.restockService = restockService;
	}

	@GetMapping
	public ResponseEntity<List<RestockDTO>> getAllRestocks() {
		return ResponseEntity.ok(restockService.getAllRestocks());
	}
}
