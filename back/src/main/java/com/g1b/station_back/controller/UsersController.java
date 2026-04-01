package com.g1b.station_back.controller;

import com.g1b.station_back.dto.UserAdminDTO;
import com.g1b.station_back.dto.UserCreateDTO;
import com.g1b.station_back.dto.UserUpdateDTO;
import com.g1b.station_back.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

	private final UserService userService;

	public UsersController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	@PreAuthorize("hasAuthority('MANAGE_USERS')")
	public ResponseEntity<List<UserAdminDTO>> getUsers() {
		return ResponseEntity.ok(userService.getUsers());
	}

	@PostMapping
	@PreAuthorize("hasAuthority('MANAGE_USERS')")
	public ResponseEntity<UserAdminDTO> createUser(@RequestBody UserCreateDTO dto) {
		return ResponseEntity.ok(userService.createUser(dto));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('MANAGE_USERS')")
	public ResponseEntity<UserAdminDTO> updateUser(@PathVariable Integer id, @RequestBody UserUpdateDTO dto) {
		return ResponseEntity.ok(userService.updateUser(id, dto));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAuthority('MANAGE_USERS')")
	public ResponseEntity<Void> deleteUser(@PathVariable Integer id, Authentication authentication) {
		userService.deleteUser(id, authentication.getName());
		return ResponseEntity.noContent().build();
	}
}
