package com.g1b.station_back.controller;

import com.g1b.station_back.dto.LoginRequestDTO;
import com.g1b.station_back.dto.LoginResponseDTO;
import com.g1b.station_back.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {

		LoginResponseDTO response = authService.login(request);
		return ResponseEntity.ok(response);
	}
}