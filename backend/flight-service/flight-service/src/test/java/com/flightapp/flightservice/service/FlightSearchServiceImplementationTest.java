package com.flightapp.flightservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
import org.springframework.data.domain.Sort;
import org.springframework.test.util.ReflectionTestUtils;

import com.flightapp.flightservice.dto.FlightSearchRequest;
import com.flightapp.flightservice.dto.FlightSearchResultResponse;
import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.enums.MealType;
import com.flightapp.flightservice.enums.SortBy;
import com.flightapp.flightservice.enums.TripType;
import com.flightapp.flightservice.exception.NoFlightsFoundException;
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
		List<Flight> flights = List.of(flight("AI101", 6000), flight("AI102", 4500));
		when(flightRepository.findByFromPlaceIgnoreCaseAndToPlaceIgnoreCaseAndDepartureTimeBetweenAndStatus(
				eq("Bangalore"), eq("Delhi"), any(), any(), eq(FlightStatus.ACTIVE), any(Sort.class)))
				.thenReturn(flights);
		FlightSearchResultResponse response = flightSearchService.searchFlights(request);
		assertEquals(2, response.getOnwardFlights().size());
		assertEquals("AI101", response.getOnwardFlights().get(0).getFlightNumber());
	}

	@Test
	void shouldThrowWhenNoFlightsFound() {
		FlightSearchRequest request = FlightSearchRequest.builder().from("Bangalore").to("Delhi")
				.departureDate(futureDate()).build();
		when(flightRepository.findByFromPlaceIgnoreCaseAndToPlaceIgnoreCaseAndDepartureTimeBetweenAndStatus(any(),
				any(), any(), any(), any(), any(Sort.class))).thenReturn(List.of());
		NoFlightsFoundException exception = assertThrows(NoFlightsFoundException.class,
				() -> flightSearchService.searchFlights(request));
		assertEquals("Noflights found for given route and date", exception.getMessage());
	}

	@Test
	void searchFlights_shoulthrowException_whenSourceAndDestinationAreSame() {
		FlightSearchRequest request = FlightSearchRequest.builder().from("bangalore").to("Bangalore")
				.departureDate(futureDate()).build();
		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
				() -> flightSearchService.searchFlights(request));
		assertEquals("Source and destination cant be the same", exception.getMessage());
	}

	@Test
	void searchFlights_shouldThrowException_whenDeparturedateIsPast() {
		FlightSearchRequest request = FlightSearchRequest.builder().from("Bangalore").to("Delhi")
				.departureDate(LocalDate.now().minusDays(1)).build();
		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
				() -> flightSearchService.searchFlights(request));
		assertEquals("Departure date cannot be in the past", exception.getMessage());
	}

	@Test
	void searchFlights_shouldReturnRoundTripResults() {
		FlightSearchRequest request = FlightSearchRequest.builder().from("Bangalore").to("Delhi")
				.departureDate(futureDate()).returnDate(futureDate().plusDays(4)).tripType(TripType.ROUND_TRIP).build();
		when(flightRepository.findByFromPlaceIgnoreCaseAndToPlaceIgnoreCaseAndDepartureTimeBetweenAndStatus(
				eq("Bangalore"), eq("Delhi"), any(), any(), eq(FlightStatus.ACTIVE), any(Sort.class)))
				.thenReturn(List.of(flight("AI101", 4500)));
		when(flightRepository.findByFromPlaceIgnoreCaseAndToPlaceIgnoreCaseAndDepartureTimeBetweenAndStatus(eq("Delhi"),
				eq("Bangalore"), any(), any(), eq(FlightStatus.ACTIVE), any(Sort.class)))
				.thenReturn(List.of(flight("AI201", 5000)));
		FlightSearchResultResponse response = flightSearchService.searchFlights(request);
		assertEquals(1, response.getOnwardFlights().size());
		assertEquals(1, response.getReturnFlights().size());
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