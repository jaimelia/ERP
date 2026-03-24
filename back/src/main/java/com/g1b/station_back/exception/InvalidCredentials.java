package com.g1b.station_back.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InvalidCredentials extends ResponseStatusException {
	public InvalidCredentials() {
		super(HttpStatus.UNAUTHORIZED, "Invalid credentials");
	}
}
