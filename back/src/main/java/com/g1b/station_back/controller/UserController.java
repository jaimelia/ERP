package com.g1b.station_back.controller;

import com.g1b.station_back.dto.UserDTO;
import com.g1b.station_back.dto.UserPreferencesDTO;
import com.g1b.station_back.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/me")
	public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {

		return ResponseEntity.ok(
				userService.getCurrentUser(userDetails.getUsername())
		);
	}

	@PutMapping("/preferences")
	public ResponseEntity<Void> savePreferences(Authentication authentication, @RequestBody UserPreferencesDTO userPreferences) {
		userService.savePreferences(authentication.getName(), userPreferences);
		return ResponseEntity.noContent().build();
	}
}
