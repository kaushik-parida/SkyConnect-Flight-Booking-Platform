package com.flightapp.airlineservice.service;

import com.flightapp.airlineservice.dto.AirlineResponse;
import com.flightapp.airlineservice.dto.CreateAirlineRequest;
public interface AirlineService {

	AirlineResponse createAirline(CreateAirlineRequest request);
}