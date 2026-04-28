package com.flightapp.flightservice.airline.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.flightapp.flightservice.airline.dto.AirlineRequest;
import com.flightapp.flightservice.airline.service.AirlineService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1.0/airline")
public class AirlineController {

	private final AirlineService airlineService;

	public AirlineController(AirlineService airlineService) {
		this.airlineService = airlineService;
	}

	@PostMapping("/register")
	public ResponseEntity<Long> register(@Valid @RequestBody AirlineRequest request) {
		return ResponseEntity.ok(airlineService.createAirline(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<String> block(
	        @PathVariable Long id,
	        @RequestBody String status) {

	    airlineService.blockAirline(id, status);
	    return ResponseEntity.ok("Airline status updated");
	}

}