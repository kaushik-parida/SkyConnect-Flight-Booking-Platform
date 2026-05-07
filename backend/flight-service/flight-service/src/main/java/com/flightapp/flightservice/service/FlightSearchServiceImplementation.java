package com.flightapp.flightservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.flightapp.flightservice.airline.model.Inventory;
import com.flightapp.flightservice.airline.repository.InventoryRepository;
import com.flightapp.flightservice.dto.FlightResponse;
import com.flightapp.flightservice.dto.FlightSearchRequest;
import com.flightapp.flightservice.dto.FlightSearchResultResponse;
import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.enums.SortBy;
import com.flightapp.flightservice.enums.TripType;
import com.flightapp.flightservice.exception.NoFlightsFoundException;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlightSearchServiceImplementation implements FlightSearchService {
	private final FlightRepository flightRepository;
	private final InventoryRepository inventoryRepository;

	@Value("${flight.place.regex}")
	private String placeRegex;
	@Value("${flight.place.message}")
	private String placeMessage;

	@Override
	public FlightSearchResultResponse searchFlights(FlightSearchRequest request) {
		validateCommonSearchRequest(request);
		TripType tripType = request.getTripType() == null ? TripType.ONE_WAY : request.getTripType();
		List<FlightResponse> onwardFlights = searchOneRoute(request.getFromPlace(), request.getToPlace(),
				request.getDepartureDate(), request);
		List<FlightResponse> returnFlights = List.of();
		if (tripType == TripType.ROUND_TRIP) {
			validateRoundTripRequest(request);
			returnFlights = searchOneRoute(request.getToPlace(), request.getFromPlace(), request.getReturnDate(),
					request);
		}
		return FlightSearchResultResponse.builder().onwardFlights(onwardFlights).returnFlights(returnFlights).build();
	}

	private void validateCommonSearchRequest(FlightSearchRequest request) {
		validatePlace(request.getFromPlace());
		validatePlace(request.getToPlace());
		if (request.getFromPlace().trim().equalsIgnoreCase(request.getToPlace().trim())) {
			throw new IllegalArgumentException("Source and destination cant be the same");
		}
		if (request.getDepartureDate().isBefore(LocalDate.now())) {
			throw new IllegalArgumentException("Departure date cannot be in the past");
		}
	}

	private List<FlightResponse> searchOneRoute(String from, String to, LocalDate date, FlightSearchRequest request) {
		LocalDateTime start = date.atStartOfDay();
		LocalDateTime end = date.atTime(23, 59, 59);
		List<Flight> flights = flightRepository
				.findByFromPlaceIgnoreCaseAndToPlaceIgnoreCaseAndDepartureTimeBetweenAndStatus(from.trim(), to.trim(),
						start, end, FlightStatus.ACTIVE, getSort(request));
		if (flights.isEmpty()) {
			throw new NoFlightsFoundException("No flights found for given route and date");
		}
		return flights.stream().map(this::mapToResponse).toList();
	}

	private Sort getSort(FlightSearchRequest request) {
		if (request.getSortBy() == null) {
			return Sort.by("departureTime").ascending();
		}
		Sort sort;
		if (request.getSortBy() == SortBy.PRICE) {
			sort = Sort.by("ticketCost");
		} else {
			sort = Sort.by("departureTime");
		}
		if (Boolean.TRUE.equals(request.getSortDirection())) {
			return sort.descending();
		}
		return sort.ascending();
	}

	private FlightResponse mapToResponse(Flight flight) {
		Optional<Inventory> inventory = inventoryRepository.findById(flight.getFlightId());

		Integer economySeats = inventory.map(Inventory::getEconomySeats).orElse(flight.getEconomySeats());
		Integer businessSeats = inventory.map(Inventory::getBusinessSeats).orElse(flight.getBusinessSeats());

		return FlightResponse.builder().flightId(flight.getFlightId()).flightNumber(flight.getFlightNumber())
				.airlineId(flight.getAirlineId()).fromPlace(flight.getFromPlace()).toPlace(flight.getToPlace())
				.departureTime(flight.getDepartureTime()).arrivalTime(flight.getArrivalTime())
				.economySeats(economySeats).businessSeats(businessSeats).ticketCost(flight.getTicketCost()).mealType(flight.getMealType())
				.status(flight.getStatus().name()).build();
	}

	private void validatePlace(String place) {
		if (!place.trim().matches(placeRegex)) {
			throw new IllegalArgumentException(placeMessage);
		}
	}

	private void validateRoundTripRequest(FlightSearchRequest request) {
		if (request.getReturnDate() == null) {
			throw new IllegalArgumentException("return date is required for round trip search");
		}
		if (request.getReturnDate().isBefore(request.getDepartureDate())) {
			throw new IllegalArgumentException("return date cannot be before departure date");
		}
		if (request.getReturnDate().isBefore(LocalDate.now())) {
			throw new IllegalArgumentException("Return date cannot be in the past");
		}
	}

	@Override
	public FlightResponse getFlightById(Long id) {
		Flight flight = flightRepository.findById(id)
				.orElseThrow(() -> new NoFlightsFoundException("Flight not found with id: " + id));
		return mapToResponse(flight);
	}

	@Override
	public List<FlightResponse> getAllFlights() {
		List<Flight> flights = flightRepository.findAll();
		return flights.stream().map(this::mapToResponse).toList();
	}
}