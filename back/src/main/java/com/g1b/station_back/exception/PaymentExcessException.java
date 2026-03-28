package com.g1b.station_back.exception;

import org.springframework.web.server.ResponseStatusException;

public class PaymentExcessException extends ResponseStatusException {

	public PaymentExcessException() {
		super(org.springframework.http.HttpStatus.BAD_REQUEST, "Payment amount exceeds the remaining balance");
	}

}
