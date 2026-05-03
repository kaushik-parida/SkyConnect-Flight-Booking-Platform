package com.flightapp.flightservice.airline.service;

import java.util.Map;

import com.flightapp.flightservice.airline.dto.InventoryRequest;

public interface InventoryService {
	Long addInventory(InventoryRequest request);

	void updateSeats(Long id, Map<String, Object> request);

}
