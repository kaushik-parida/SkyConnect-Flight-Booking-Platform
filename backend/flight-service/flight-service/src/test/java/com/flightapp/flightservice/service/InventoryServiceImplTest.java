package com.flightapp.flightservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import java.util.Date;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.flightapp.flightservice.airline.dto.InventoryRequest;
import com.flightapp.flightservice.airline.model.Inventory;
import com.flightapp.flightservice.airline.repository.InventoryRepository;
import com.flightapp.flightservice.airline.service.InventoryServiceImpl;

public class InventoryServiceImplTest {
	@Mock
	private InventoryRepository inventoryRepository;

	@InjectMocks
	private InventoryServiceImpl inventoryService;

	@BeforeEach
	void setup() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void AddInventorySuccess() {

		InventoryRequest request = new InventoryRequest();
		request.setAirlineId(1L);
		request.setFlightNumber("AI101");
		request.setSource("Bangalore");
		request.setDestination("Delhi");
		request.setDepartureTime(new Date());
		request.setArrivalTime(new Date());
		request.setEconomySeats(120);
		request.setBusinessSeats(20);

		Inventory saved = Inventory.builder().id(1L).airlineId(1L).flightNumber("AI101").build();

		when(inventoryRepository.save(any(Inventory.class))).thenReturn(saved);

		Long result = inventoryService.addInventory(request);

		assertNotNull(result);
		assertEquals(1L, result);
	}

	@Test
	void AddInventory_MissingFlightNumber() {

		InventoryRequest request = new InventoryRequest();
		request.setAirlineId(1L);
		request.setFlightNumber(null);

		Exception exception = assertThrows(Exception.class, () -> {
			inventoryService.addInventory(request);
		});

		assertNotNull(exception);
	}

	@Test
	void AddInventory_ZeroSeats() {

		InventoryRequest request = new InventoryRequest();
		request.setAirlineId(1L);
		request.setFlightNumber("AI101");
		request.setEconomySeats(0);
		request.setBusinessSeats(0);

		Inventory saved = Inventory.builder().id(2L).build();

		when(inventoryRepository.save(any(Inventory.class))).thenReturn(saved);

		Long result = inventoryService.addInventory(request);

		assertEquals(2L, result);
	}

	@Test
	void AddInventory_NullAirlineId() {

		InventoryRequest request = new InventoryRequest();
		request.setAirlineId(null);
		request.setFlightNumber("AI101");

		Inventory saved = Inventory.builder().id(3L).build();

		when(inventoryRepository.save(any(Inventory.class))).thenReturn(saved);

		Long result = inventoryService.addInventory(request);

		assertEquals(3L, result);
	}

}
