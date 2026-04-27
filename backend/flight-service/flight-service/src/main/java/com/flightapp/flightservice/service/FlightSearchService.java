package com.flightapp.flightservice.service;

import com.flightapp.flightservice.dto.FlightSearchRequest;
import com.flightapp.flightservice.dto.FlightSearchResultResponse;

public interface FlightSearchService {
    FlightSearchResultResponse searchFlights(FlightSearchRequest request);
}