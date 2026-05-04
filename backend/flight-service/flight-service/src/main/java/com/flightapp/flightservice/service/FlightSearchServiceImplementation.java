package com.flightapp.flightservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
	@Value("${flight.place.regex}")
	private String placeRegex;
	@Value("${flight.place.message}")
	private String placeMessage;

	@Override
	public FlightSearchResultResponse searchFlights(FlightSearchRequest request) {
		validateCommonSearchRequest(request);
		TripType tripType = request.getTripType() == null ? TripType.ONE_WAY : request.getTripType();
		List<FlightResponse> onwardFlights = searchOneRoute(request.getFrom(), request.getTo(),
				request.getDepartureDate(), request);
		List<FlightResponse> returnFlights = List.of();
		if (tripType == TripType.ROUND_TRIP) {
			validateRoundTripRequest(request);
			returnFlights = searchOneRoute(request.getTo(), request.getFrom(), request.getReturnDate(), request);
		}
		return FlightSearchResultResponse.builder().onwardFlights(onwardFlights).returnFlights(returnFlights).build();
	}

	private void validateCommonSearchRequest(FlightSearchRequest request) {
		validatePlace(request.getFrom());
		validatePlace(request.getTo());
		if (request.getFrom().trim().equalsIgnoreCase(request.getTo().trim())) {
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
			throw new NoFlightsFoundException("Noflights found for given route and date");
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
		return FlightResponse.builder().flightId(flight.getFlightId()).flightNumber(flight.getFlightNumber())
				.airlineId(flight.getAirlineId()).fromPlace(flight.getFromPlace()).toPlace(flight.getToPlace())
				.departureTime(flight.getDepartureTime()).arrivalTime(flight.getArrivalTime())
				.economySeats(flight.getEconomySeats()).businessSeats(flight.getBusinessSeats())
				.ticketCost(flight.getTicketCost()).status(flight.getStatus().name()).build();
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

}