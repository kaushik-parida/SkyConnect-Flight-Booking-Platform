package com.flightapp.flightservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.flightapp.flightservice.airline.repository.InventoryRepository;
import com.flightapp.flightservice.dto.FlightCreateRequest;
import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.enums.MealType;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;

@ExtendWith(MockitoExtension.class)
class FlightCreateServiceImplementationTest {
	@Mock
	private FlightRepository flightRepository;

	@Mock
	private InventoryRepository inventoryRepository;

	@InjectMocks
	private FlightCreateServiceImplementation flightCreateService;

	@BeforeEach
	void setUp() {
		ReflectionTestUtils.setField(flightCreateService, "placeRegex", "^[A-Za-z ]+$");
		ReflectionTestUtils.setField(flightCreateService, "placeMessage", "Place must contain only letters");
	}

	@Test
	void createFlight_shouldReturnFlightId_whenRequestIsValid() {
		FlightCreateRequest request = validRequest();
		Flight savedFlight = Flight.builder().flightId(1L).flightNumber("AI301").airlineId(1L).fromPlace("Bangalore")
				.toPlace("Delhi").departureTime(request.getDepartureTime()).arrivalTime(request.getArrivalTime())
				.economySeats(100).businessSeats(20).ticketCost(BigDecimal.valueOf(5000)).mealType(MealType.VEG)
				.status(FlightStatus.ACTIVE).build();
		when(flightRepository.existsByFlightNumberIgnoreCase("AI301")).thenReturn(false);
		when(flightRepository.save(any())).thenReturn(savedFlight);
		Long result = flightCreateService.createFlight(request);
		assertEquals(1L, result);
		verify(flightRepository).existsByFlightNumberIgnoreCase("AI301");
		verify(flightRepository).save(any());
	}

	@Test
	void createFlight_shouldThrowException_whenFlightNumberAlreadyExists() {
		FlightCreateRequest request = validRequest();
		when(flightRepository.existsByFlightNumberIgnoreCase("AI301")).thenReturn(true);
		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
				() -> flightCreateService.createFlight(request));
		assertEquals("flight number already exists", exception.getMessage());
		verify(flightRepository, never()).save(any());
	}

	@Test
	void createFlight_shouldThrowException_whenArrivalIsBeforeDeparture() {
		FlightCreateRequest request = validRequest();
		request.setDepartureTime(LocalDateTime.of(2026, 5, 1, 12, 0));
		request.setArrivalTime(LocalDateTime.of(2026, 5, 1, 10, 0));
		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
				() -> flightCreateService.createFlight(request));
		assertEquals("Arrival time must be after departure time", exception.getMessage());
		verify(flightRepository, never()).save(any());
	}

	@Test
	void createFlight_shouldThrowException_whenSourceAndDestinationAreSame() {
		FlightCreateRequest request = validRequest();
		request.setToPlace("Bangalore");
		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
				() -> flightCreateService.createFlight(request));
		assertEquals("Source and destination cannot be the same", exception.getMessage());
		verify(flightRepository, never()).save(any());
	}

	@Test
	void createFlight_shouldThrowException_whenBothSeatTypesAreZero() {
		FlightCreateRequest request = validRequest();
		request.setEconomySeats(0);
		request.setBusinessSeats(0);
		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
				() -> flightCreateService.createFlight(request));
		assertEquals("At least one seat class must have seats", exception.getMessage());
		verify(flightRepository, never()).save(any());
	}

	@Test
	void createFlight_shouldThrowException_whenSourceHasInvalidCharacters() {
		FlightCreateRequest request = validRequest();
		request.setFromPlace("Bangalore123");
		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
				() -> flightCreateService.createFlight(request));
		assertEquals("Place must contain only letters", exception.getMessage());
		verify(flightRepository, never()).save(any());
	}

	private FlightCreateRequest validRequest() {
		return FlightCreateRequest.builder().flightNumber("AI301").airlineId(1L).fromPlace("Bangalore").toPlace("Delhi")
				.departureTime(LocalDateTime.of(2026, 5, 1, 9, 0)).arrivalTime(LocalDateTime.of(2026, 5, 1, 11, 0))
				.economySeats(100).businessSeats(20).ticketCost(BigDecimal.valueOf(5000)).mealType(MealType.VEG)
				.build();
	}
}