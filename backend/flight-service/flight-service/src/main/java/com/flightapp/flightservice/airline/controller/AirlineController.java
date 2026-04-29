package com.flightapp.flightservice.airline.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flightapp.flightservice.airline.dto.AirlineRequest;
import com.flightapp.flightservice.airline.dto.InventoryRequest;
import com.flightapp.flightservice.airline.service.AirlineService;
import com.flightapp.flightservice.airline.service.InventoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1.0/airline")
public class AirlineController {

	private final AirlineService airlineService;
	private final InventoryService inventoryService;

	public AirlineController(AirlineService airlineService, InventoryService inventoryService) {
		this.airlineService = airlineService;
		this.inventoryService = inventoryService;
	}

	@PostMapping("/register")
	public ResponseEntity<Long> register(@Valid @RequestBody AirlineRequest request) {
		return ResponseEntity.ok(airlineService.createAirline(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<String> block(@PathVariable Long id, @RequestBody String status) {

		airlineService.blockAirline(id, status);
		return ResponseEntity.ok("Airline status updated");
	}

	@PostMapping("/inventory/add")
	public ResponseEntity<Long> addInventory(@RequestBody InventoryRequest request) {
		return ResponseEntity.ok(inventoryService.addInventory(request));
	}
}