package com.flightapp.flightservice.airline.service;

import com.flightapp.flightservice.airline.dto.AirlineRequest;

public interface AirlineService {
	Long createAirline(AirlineRequest request);

	void blockAirline(Long id, String status);

}
