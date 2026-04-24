package com.flightapp.booking.exception;

public class FlightServiceUnavailableException extends RuntimeException {
	public FlightServiceUnavailableException(String message) {
		super(message);
	}
}