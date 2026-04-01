package com.g1b.station_back.service;

import com.g1b.station_back.dto.UserAdminDTO;
import com.g1b.station_back.dto.UserCreateDTO;
import com.g1b.station_back.dto.UserDTO;
import com.g1b.station_back.dto.UserPreferencesDTO;
import com.g1b.station_back.dto.UserUpdateDTO;
import com.g1b.station_back.exception.UserNotFound;
import com.g1b.station_back.model.User;
import com.g1b.station_back.model.enums.Role;
import com.g1b.station_back.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public UserDTO getCurrentUser(String username) {

		User user = userRepository.findByUsername(username)
				.orElseThrow(UserNotFound::new);
		
		return new UserDTO(
				user.getUsername(),
				user.getEmail(),
				user.getRole().name(),
				user.getUsesDarkMode(),
				user.getTileLayout()
		);
	}

	public List<UserAdminDTO> getUsers() {
		return userRepository.findAll()
				.stream()
				.map(this::toAdminDTO)
				.toList();
	}

	public UserAdminDTO createUser(UserCreateDTO dto) {
		if (dto.username() == null || dto.username().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nom d'utilisateur invalide");
		}
		if (dto.password() == null || dto.password().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mot de passe invalide");
		}
		if (userRepository.existsByUsername(dto.username())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Nom d'utilisateur deja utilise");
		}

		User user = new User();
		user.setUsername(dto.username().trim());
		user.setEmail(dto.email() == null ? "" : dto.email().trim());
		user.setPassword(passwordEncoder.encode(dto.password()));
		user.setRole(parseRole(dto.role()));
		user.setUsesDarkMode(false);
		user.setTileLayout(null);

		User saved = userRepository.save(user);
		return toAdminDTO(saved);
	}

	public UserAdminDTO updateUser(Integer id, UserUpdateDTO dto) {
		User user = userRepository.findById(id)
				.orElseThrow(UserNotFound::new);

		if (dto.username() != null && !dto.username().isBlank()) {
			String nextUsername = dto.username().trim();
			if (!nextUsername.equals(user.getUsername()) && userRepository.existsByUsername(nextUsername)) {
				throw new ResponseStatusException(HttpStatus.CONFLICT, "Nom d'utilisateur deja utilise");
			}
			user.setUsername(nextUsername);
		}
		if (dto.email() != null && !dto.email().isBlank()) {
			user.setEmail(dto.email().trim());
		}
		if (dto.role() != null && !dto.role().isBlank()) {
			user.setRole(parseRole(dto.role()));
		}
		if (dto.password() != null && !dto.password().isBlank()) {
			user.setPassword(passwordEncoder.encode(dto.password()));
		}

		User saved = userRepository.save(user);
		return toAdminDTO(saved);
	}

	public void deleteUser(Integer id, String currentUsername) {
		User user = userRepository.findById(id)
				.orElseThrow(UserNotFound::new);

		if (user.getUsername().equals(currentUsername)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible de supprimer son propre compte");
		}

		userRepository.delete(user);
	}

	public void savePreferences(String username, UserPreferencesDTO userPreferences) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(UserNotFound::new);
		
		if (userPreferences.darkMode() != null) user.setUsesDarkMode(userPreferences.darkMode());
		if (userPreferences.tileLayout() != null) user.setTileLayout(userPreferences.tileLayout());
		userRepository.save(user);
	}

	private UserAdminDTO toAdminDTO(User user) {
		return new UserAdminDTO(
				user.getIdUser(),
				user.getUsername(),
				user.getEmail(),
				user.getRole().name(),
				user.getUsesDarkMode()
		);
	}

	private Role parseRole(String roleValue) {
		if (roleValue == null || roleValue.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role invalide");
		}
		try {
			return Role.valueOf(roleValue);
		} catch (IllegalArgumentException ex) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role invalide");
		}
	}
}
