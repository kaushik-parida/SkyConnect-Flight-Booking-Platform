package com.flightapp.airlineservice.controller;
import com.flightapp.airlineservice.dto.AirlineResponse;
import com.flightapp.airlineservice.dto.CreateAirlineRequest;
import com.flightapp.airlineservice.service.AirlineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/airlines")
@RequiredArgsConstructor
public class AirlineController {

	private final AirlineService airlineService;

	@PostMapping
	public ResponseEntity<AirlineResponse> createAirline(@Valid @RequestBody CreateAirlineRequest request) {

		return ResponseEntity.ok(airlineService.createAirline(request));
	}
}