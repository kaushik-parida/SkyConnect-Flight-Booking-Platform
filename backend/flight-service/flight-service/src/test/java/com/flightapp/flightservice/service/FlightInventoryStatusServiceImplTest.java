package com.flightapp.flightservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;

@ExtendWith(MockitoExtension.class)
class FlightInventoryStatusServiceImplTest {

	@Mock
	private FlightRepository flightRepository;

	@InjectMocks
	private FlightInventoryStatusServiceImpl flightInventoryStatusService;

	@Test
	void updateFlightsByAirlineStatus_shouldMakeFlightsInactive_whenAirlineBlocked() {
		Flight flight = Flight.builder().flightId(1L).airlineId(1L).status(FlightStatus.ACTIVE).build();
		when(flightRepository.findByAirlineId(1L)).thenReturn(List.of(flight));
		int result = flightInventoryStatusService.updateFlightsByAirlineStatus(1L, "BLOCKED");
		assertEquals(1, result);
		assertEquals(FlightStatus.INACTIVE, flight.getStatus());
		verify(flightRepository).saveAll(List.of(flight));
	}

	@Test
	void updateFlightsByAirlineStatus_shouldMakeFlightsActive_whenAirlineActive() {
		Flight flight = Flight.builder().flightId(1L).airlineId(1L).status(FlightStatus.INACTIVE).build();
		when(flightRepository.findByAirlineId(1L)).thenReturn(List.of(flight));
		int result = flightInventoryStatusService.updateFlightsByAirlineStatus(1L, "ACTIVE");
		assertEquals(1, result);
		assertEquals(FlightStatus.ACTIVE, flight.getStatus());
		verify(flightRepository).saveAll(List.of(flight));
	}
}