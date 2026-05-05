package com.flightapp.flightservice.airline.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.flightapp.flightservice.airline.dto.InventoryRequest;
import com.flightapp.flightservice.airline.model.Inventory;
import com.flightapp.flightservice.airline.repository.InventoryRepository;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

	private final InventoryRepository inventoryRepository;
	private final FlightRepository flightRepository;

	@Override
	public Long addInventory(InventoryRequest request) {
		Flight flight = flightRepository.findByFlightNumberIgnoreCase(request.getFlightNumber().trim())
				.orElseThrow(() -> new RuntimeException("Flight not found with number: " + request.getFlightNumber()));

		Inventory inventory = Inventory.builder().flight(flight).airlineId(request.getAirlineId())
				.flightNumber(request.getFlightNumber().trim()).fromPlace(request.getFromPlace().trim())
				.toPlace(request.getToPlace().trim()).departureTime(request.getDepartureTime())
				.arrivalTime(request.getArrivalTime()).economySeats(request.getEconomySeats())
				.businessSeats(request.getBusinessSeats()).build();

		return inventoryRepository.save(inventory).getId();
	}

	@Override
	public void updateSeats(Long id, Map<String, Object> request) {
		Inventory inventory = inventoryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

		if (request.containsKey("economySeats")) {
			inventory.setEconomySeats((Integer) request.get("economySeats"));
		}

		if (request.containsKey("businessSeats")) {
			inventory.setBusinessSeats((Integer) request.get("businessSeats"));
		}

		inventoryRepository.save(inventory);
	}
}
