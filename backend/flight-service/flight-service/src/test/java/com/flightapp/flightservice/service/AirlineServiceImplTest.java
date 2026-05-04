package com.flightapp.flightservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.flightapp.flightservice.airline.dto.AirlineRequest;
import com.flightapp.flightservice.airline.enums.AirlineStatus;
import com.flightapp.flightservice.airline.model.Airline;
import com.flightapp.flightservice.airline.repository.AirlineRepository;
import com.flightapp.flightservice.airline.service.AirlineServiceImpl;

public class AirlineServiceImplTest {
	@Mock
	private AirlineRepository airlineRepository;

	@Mock
	private FlightInventoryStatusService flightInventoryStatusService;

	@InjectMocks
	private AirlineServiceImpl airlineService;

	@BeforeEach
	void setup() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void CreateAirline() {
		AirlineRequest request = new AirlineRequest();
		request.setName("Indigo");

		Airline savedAirline = Airline.builder().airlineId(1L).name("Indigo").status(AirlineStatus.ACTIVE).build();

		when(airlineRepository.save(any(Airline.class))).thenReturn(savedAirline);
		Long result = airlineService.createAirline(request);
		assertNotNull(result);
		assertEquals(1L, result);
	}

	@Test
	void CreateAirlineWithEmptyName() {
		AirlineRequest request = new AirlineRequest();
		request.setName("");
		Exception exception = assertThrows(Exception.class, () -> {
			airlineService.createAirline(request);
		});
		assertNotNull(exception);
	}

	@Test
	void BlockAirline() {
		Airline airline = Airline.builder().airlineId(1L).name("Indigo").status(AirlineStatus.ACTIVE).build();
		when(airlineRepository.findById(1L)).thenReturn(Optional.of(airline));
		airlineService.blockAirline(1L, "BLOCKED");
		assertEquals(AirlineStatus.BLOCKED, airline.getStatus());
	}

	@Test
	void UnblockAirline() {
		Airline airline = Airline.builder().airlineId(1L).name("Indigo").status(AirlineStatus.BLOCKED).build();
		when(airlineRepository.findById(1L)).thenReturn(Optional.of(airline));
		airlineService.blockAirline(1L, "ACTIVE");
		assertEquals(AirlineStatus.ACTIVE, airline.getStatus());
	}

	@Test
	void BlockAirline_NotFound() {
		when(airlineRepository.findById(1L)).thenReturn(Optional.empty());
		Exception exception = assertThrows(RuntimeException.class, () -> {
			airlineService.blockAirline(1L, "BLOCKED");
		});
		assertEquals("Airline not found", exception.getMessage());
	}
}
