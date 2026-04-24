package com.flightapp.flightservice.service;

import com.flightapp.flightservice.dto.FlightCreateRequest;
public interface FlightCreateService {
    Long createFlight(FlightCreateRequest request);
}