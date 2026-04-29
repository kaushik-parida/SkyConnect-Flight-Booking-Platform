package com.flightapp.booking.exception;

public class DuplicateBookingException extends RuntimeException {
	public DuplicateBookingException(String message) {
		super(message);
	}
}
