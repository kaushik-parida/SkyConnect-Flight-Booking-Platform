package com.flightapp.flightservice.service;

public interface FlightInventoryStatusService {
	int updateFlightsByAirlineStatus(Long airlineId, String airlineStatus);

}
