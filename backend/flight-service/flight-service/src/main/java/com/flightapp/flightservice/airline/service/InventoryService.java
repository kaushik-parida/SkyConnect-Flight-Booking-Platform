package com.flightapp.flightservice.airline.service;

import com.flightapp.flightservice.airline.dto.InventoryRequest;

public interface InventoryService {
	Long addInventory(InventoryRequest request);

}
