package com.flightapp.flightservice.controller;

import com.flightapp.flightservice.dto.FlightSearchRequest;
import com.flightapp.flightservice.dto.FlightSearchResultResponse;
import com.flightapp.flightservice.service.FlightSearchService;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/v1.0/flight")
@RequiredArgsConstructor
public class FlightSearchController {
    private final FlightSearchService flightSearchService;
    @PostMapping("/search")
    public ResponseEntity<FlightSearchResultResponse> searchFlights(@Valid @RequestBody FlightSearchRequest request) {
        FlightSearchResultResponse response = flightSearchService.searchFlights(request);
        return ResponseEntity.ok(response);
    }
}