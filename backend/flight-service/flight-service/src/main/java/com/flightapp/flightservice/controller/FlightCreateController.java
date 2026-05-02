package com.flightapp.flightservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flightapp.flightservice.constant.AppConstants;
import com.flightapp.flightservice.dto.FlightCreateRequest;
import com.flightapp.flightservice.service.FlightCreateService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0/flights")
@RequiredArgsConstructor
@Tag(name = "Flight Management", description = "APIs for managing flights")
@CrossOrigin(origins = "http://localhost:3000")
public class FlightCreateController {
	private final FlightCreateService flightCreateService;

	@Operation(summary = "Create flight", description = "Allows admin users to add new flight into flight inventory")
	@PostMapping
	public ResponseEntity<Long> createFlight(
			@Parameter(description = "User role forwarded by API Gateway", example = "ADMIN") @RequestHeader(value = AppConstants.USER_ROLE_HEADER, required = false) String userRole,
			@Valid @RequestBody FlightCreateRequest request) {
		if (userRole == null || !AppConstants.ADMIN_ROLE.equalsIgnoreCase(userRole)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		Long flightId = flightCreateService.createFlight(request);
		return ResponseEntity.status(201).body(flightId);
	}
}