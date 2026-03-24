package com.g1b.station_back.service;

import com.g1b.station_back.dto.LoginRequestDTO;
import com.g1b.station_back.dto.LoginResponseDTO;
import com.g1b.station_back.exception.InvalidCredentials;
import com.g1b.station_back.jwt.JwtUtils;
import com.g1b.station_back.model.User;
import com.g1b.station_back.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtils jwtUtils;

	public AuthService(UserRepository userRepository,
						   PasswordEncoder passwordEncoder,
						   JwtUtils jwtUtils) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtils = jwtUtils;
	}
	
	public LoginResponseDTO login(LoginRequestDTO request) {
		
		User user = userRepository.findByUsername(request.username())
				.orElseThrow(InvalidCredentials::new);

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new InvalidCredentials();
		}

		String token = jwtUtils.generateJwtToken(user.getUsername());

		return new LoginResponseDTO(token);
	}
}