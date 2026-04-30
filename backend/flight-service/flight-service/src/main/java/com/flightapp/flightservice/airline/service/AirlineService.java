package com.flightapp.flightservice.airline.service;

import java.util.List;

import com.flightapp.flightservice.airline.dto.AirlineRequest;
import com.flightapp.flightservice.airline.model.Airline;

public interface AirlineService {
	Long createAirline(AirlineRequest request);

	void blockAirline(Long id, String status);

	List<Airline> getAllAirlines();

}
