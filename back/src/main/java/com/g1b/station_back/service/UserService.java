package com.g1b.station_back.service;

import com.g1b.station_back.dto.UserDTO;
import com.g1b.station_back.dto.UserPreferencesDTO;
import com.g1b.station_back.exception.UserNotFound;
import com.g1b.station_back.model.User;
import com.g1b.station_back.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class UserService {

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public UserDTO getCurrentUser(String username) {

		User user = userRepository.findByUsername(username)
				.orElseThrow(UserNotFound::new);
		
		return new UserDTO(
				user.getUsername(),
				user.getEmail(),
				user.getRole(),
				user.getUsesDarkMode(),
				user.getTileLayout()
		);
	}

	public void savePreferences(String username, UserPreferencesDTO userPreferences) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(UserNotFound::new);
		
		if (userPreferences.darkMode() != null) user.setUsesDarkMode(userPreferences.darkMode());
		if (userPreferences.tileLayout() != null) user.setTileLayout(userPreferences.tileLayout());
		userRepository.save(user);
	}
}