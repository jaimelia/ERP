package com.g1b.station_back.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InsufficientStockException extends ResponseStatusException {
    public InsufficientStockException(String productName) {
        super(HttpStatus.CONFLICT, "Stock insuffisant pour : " + productName);
    }
}
