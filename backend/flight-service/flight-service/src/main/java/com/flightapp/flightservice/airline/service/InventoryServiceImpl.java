package com.flightapp.flightservice.airline.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.flightapp.flightservice.airline.dto.InventoryRequest;
import com.flightapp.flightservice.airline.model.Inventory;
import com.flightapp.flightservice.airline.repository.InventoryRepository;

@Service
public class InventoryServiceImpl implements InventoryService {

	private final InventoryRepository inventoryRepository;

	public InventoryServiceImpl(InventoryRepository inventoryRepository) {
		this.inventoryRepository = inventoryRepository;
	}

	@Override
	public Long addInventory(InventoryRequest request) {

		Inventory inventory = Inventory.builder().airlineId(request.getAirlineId())
				.flightNumber(request.getFlightNumber()).source(request.getSource())
				.destination(request.getDestination()).departureTime(request.getDepartureTime())
				.arrivalTime(request.getArrivalTime()).economySeats(request.getEconomySeats())
				.businessSeats(request.getBusinessSeats()).build();

		return inventoryRepository.save(inventory).getId();
	}

	@Override
	public void updateSeats(Long id, Map<String, Object> request) {

		Inventory inventory = inventoryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Flight not found"));

		if (request.containsKey("economySeats")) {
			inventory.setEconomySeats((Integer) request.get("economySeats"));
		}

		if (request.containsKey("businessSeats")) {
			inventory.setBusinessSeats((Integer) request.get("businessSeats"));
		}

		inventoryRepository.save(inventory);
	}
}
