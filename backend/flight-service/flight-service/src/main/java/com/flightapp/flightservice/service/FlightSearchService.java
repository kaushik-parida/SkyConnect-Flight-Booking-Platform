package com.flightapp.flightservice.service;

import com.flightapp.flightservice.dto.FlightResponse;
import com.flightapp.flightservice.dto.FlightSearchRequest;

import java.util.List;

public interface FlightSearchService {
    List<FlightResponse> searchFlights(FlightSearchRequest request);
}