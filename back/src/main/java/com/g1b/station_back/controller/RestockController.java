package com.g1b.station_back.controller;

import com.g1b.station_back.dto.PostRestockDTO;
import com.g1b.station_back.dto.RestockDTO;
import com.g1b.station_back.service.RestockService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

	@PostMapping
	public ResponseEntity<RestockDTO> createRestock(@RequestBody PostRestockDTO dto) {
		return ResponseEntity.ok(restockService.createRestock(dto));
	}
}
