package com.flightapp.flightservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.flightapp.flightservice.airline.dto.InventoryRequest;
import com.flightapp.flightservice.airline.model.Inventory;
import com.flightapp.flightservice.airline.repository.InventoryRepository;
import com.flightapp.flightservice.airline.service.InventoryServiceImpl;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;

public class InventoryServiceImplTest {

	@Mock
	private InventoryRepository inventoryRepository;

	@Mock
	private FlightRepository flightRepository;

	private InventoryServiceImpl inventoryService;

	@BeforeEach
	void setup() {
		MockitoAnnotations.openMocks(this);
		inventoryService = new InventoryServiceImpl(inventoryRepository, flightRepository);
	}

	@Test
	void AddInventorySuccess() {
		InventoryRequest request = new InventoryRequest();
		request.setAirlineId(1L);
		request.setFlightNumber("AI101");
		request.setFromPlace("Bangalore");
		request.setToPlace("Delhi");
		request.setDepartureTime(LocalDateTime.now());
		request.setArrivalTime(LocalDateTime.now().plusHours(2));
		request.setEconomySeats(120);
		request.setBusinessSeats(20);

		Flight flight = Flight.builder().flightId(1L).flightNumber("AI101").build();
		Inventory saved = Inventory.builder().id(1L).flight(flight).airlineId(1L).flightNumber("AI101").build();

		when(flightRepository.findByFlightNumberIgnoreCase(anyString())).thenReturn(Optional.of(flight));
		when(inventoryRepository.save(any(Inventory.class))).thenReturn(saved);

		Long result = inventoryService.addInventory(request);

		assertNotNull(result);
		assertEquals(1L, result);
	}

	@Test
	void AddInventory_FlightNotFound() {
		InventoryRequest request = new InventoryRequest();
		request.setFlightNumber("NONEXISTENT");

		when(flightRepository.findByFlightNumberIgnoreCase(anyString())).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> {
			inventoryService.addInventory(request);
		});
	}

	@Test
	void AddInventory_NullFlightNumber() {
		InventoryRequest request = new InventoryRequest();
		request.setFlightNumber(null);
		assertThrows(NullPointerException.class, () -> {
			inventoryService.addInventory(request);
		});
	}

	@Test
	void AddInventory_ZeroSeats() {
		InventoryRequest request = new InventoryRequest();
		request.setAirlineId(1L);
		request.setFlightNumber("AI101");
		request.setFromPlace("A");
		request.setToPlace("B");
		request.setEconomySeats(0);
		request.setBusinessSeats(0);

		Flight flight = Flight.builder().flightId(2L).flightNumber("AI101").build();
		Inventory saved = Inventory.builder().id(2L).flight(flight).build();

		when(flightRepository.findByFlightNumberIgnoreCase(anyString())).thenReturn(Optional.of(flight));
		when(inventoryRepository.save(any(Inventory.class))).thenReturn(saved);

		Long result = inventoryService.addInventory(request);

		assertEquals(2L, result);
	}
}
