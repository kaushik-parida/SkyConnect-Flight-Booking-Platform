package com.flightapp.flightservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flightapp.flightservice.dto.FlightSearchRequest;
import com.flightapp.flightservice.dto.FlightSearchResultResponse;
import com.flightapp.flightservice.service.FlightSearchService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0/flight")
@RequiredArgsConstructor
@Tag(name = "Flight Search", description = "APIs for one-way and round-trip flight search")
public class FlightSearchController {
	private final FlightSearchService flightSearchService;

	@Operation(summary = "Search flights", description = "Search flights by source, destination, departure date, trip type, and sorting options")

	@PostMapping("/search")
	public ResponseEntity<FlightSearchResultResponse> searchFlights(@Valid @RequestBody FlightSearchRequest request) {
		FlightSearchResultResponse response = flightSearchService.searchFlights(request);
		return ResponseEntity.ok(response);
	}
}