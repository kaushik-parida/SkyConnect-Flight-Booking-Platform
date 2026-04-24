package com.flightapp.booking.exception;

public class FlightNotActiveException extends RuntimeException {
	public FlightNotActiveException(String message) {
		super(message);
	}
}