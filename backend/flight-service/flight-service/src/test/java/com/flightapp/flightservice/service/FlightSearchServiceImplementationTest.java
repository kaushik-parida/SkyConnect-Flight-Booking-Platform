package com.flightapp.flightservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.flightapp.flightservice.dto.FlightSearchRequest;
import com.flightapp.flightservice.dto.FlightSearchResultResponse;
import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.enums.MealType;
import com.flightapp.flightservice.enums.SortBy;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;

@ExtendWith(MockitoExtension.class)
class FlightSearchServiceImplementationTest {

	@Mock
	private FlightRepository flightRepository;

	@InjectMocks
	private FlightSearchServiceImplementation flightSearchService;

	@BeforeEach
	void setUp() {
		ReflectionTestUtils.setField(flightSearchService, "placeRegex", "^[A-Za-z ]+$");
		ReflectionTestUtils.setField(flightSearchService, "placeMessage", "Place must contain only letters");
	}

	@Test
	void searchFlights_shouldReturnSortedByPriceDesc() {

		FlightSearchRequest request = FlightSearchRequest.builder().from("Bangalore").to("Delhi")
				.departureDate(futureDate()).sortBy(SortBy.PRICE).sortDirection(true).build();
		List<Flight> flights = List.of(flight("AI101", 4500), flight("AI102", 6000));
		when(flightRepository.findByFromPlaceIgnoreCaseAndToPlaceIgnoreCaseAndDepartureTimeBetweenAndStatus(
				eq("Bangalore"), eq("Delhi"), any(), any(), eq(FlightStatus.ACTIVE))).thenReturn(flights);
		FlightSearchResultResponse response = flightSearchService.searchFlights(request);
		assertEquals(2, response.getOnwardFlights().size());
		assertEquals("AI102", response.getOnwardFlights().get(0).getFlightNumber());
	}

	private LocalDate futureDate() {
		return LocalDate.now().plusDays(10);
	}

	private Flight flight(String number, double price) {
		return Flight.builder().flightId(1L).flightNumber(number).airlineId(1L).fromPlace("Bangalore").toPlace("Delhi")
				.departureTime(LocalDateTime.now().plusDays(5))
				.arrivalTime(LocalDateTime.now().plusDays(5).plusHours(2)).economySeats(100).businessSeats(20)
				.ticketCost(BigDecimal.valueOf(price)).mealType(MealType.VEG).status(FlightStatus.ACTIVE).build();
	}
}