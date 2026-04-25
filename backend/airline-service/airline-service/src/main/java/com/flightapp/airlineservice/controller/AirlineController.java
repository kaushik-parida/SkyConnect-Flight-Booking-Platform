package com.flightapp.airlineservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flightapp.airlineservice.dto.AirlineResponse;
import com.flightapp.airlineservice.dto.CreateAirlineRequest;
import com.flightapp.airlineservice.service.AirlineService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/airlines")
@RequiredArgsConstructor
public class AirlineController {

	private final AirlineService airlineService;

	@PostMapping
	public ResponseEntity<AirlineResponse> createAirline(@Valid @RequestBody CreateAirlineRequest request) {

		return ResponseEntity.ok(airlineService.createAirline(request));
	}

	@GetMapping
	public ResponseEntity<List<AirlineResponse>> getAllAirlines() {
		return ResponseEntity.ok(airlineService.getAllAirlines());
	}

	@GetMapping("/{id}")
	public ResponseEntity<AirlineResponse> getAirlineById(@PathVariable Long id) {
		return ResponseEntity.ok(airlineService.getAirlineById(id));
	}
}