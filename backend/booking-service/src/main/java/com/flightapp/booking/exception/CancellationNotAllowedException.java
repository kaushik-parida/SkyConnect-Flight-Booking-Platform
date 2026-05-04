package com.flightapp.booking.exception;

public class CancellationNotAllowedException extends RuntimeException {
	public CancellationNotAllowedException(String message) {
		super(message);
	}
}
