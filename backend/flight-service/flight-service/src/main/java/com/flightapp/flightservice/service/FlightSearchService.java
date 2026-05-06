package com.flightapp.flightservice.service;

import java.util.List;

import com.flightapp.flightservice.dto.FlightResponse;
import com.flightapp.flightservice.dto.FlightSearchRequest;
import com.flightapp.flightservice.dto.FlightSearchResultResponse;

public interface FlightSearchService {
	FlightSearchResultResponse searchFlights(FlightSearchRequest request);

	FlightResponse getFlightById(Long id);

	List<FlightResponse> getAllFlights();
}