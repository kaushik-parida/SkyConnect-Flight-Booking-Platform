package com.flightapp.flightservice.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flightapp.flightservice.airline.model.Inventory;
import com.flightapp.flightservice.airline.repository.InventoryRepository;
import com.flightapp.flightservice.dto.FlightCreateRequest;
import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlightCreateServiceImplementation implements FlightCreateService {

	private final FlightRepository flightRepository;
	private final InventoryRepository inventoryRepository;

	@Value("${flight.place.regex}")
	private String placeRegex;

	@Value("${flight.place.message}")
	private String placeMessage;

	@Override
	@Transactional
	public Long createFlight(FlightCreateRequest request) {
		validateCreateRequest(request);

		if (flightRepository.existsByFlightNumberIgnoreCase(request.getFlightNumber().trim())) {
			throw new IllegalArgumentException("flight number already exists");
		}

		Flight flight = Flight.builder().flightNumber(request.getFlightNumber().trim())
				.airlineId(request.getAirlineId()).fromPlace(request.getFromPlace().trim())
				.toPlace(request.getToPlace().trim()).departureTime(request.getDepartureTime())
				.arrivalTime(request.getArrivalTime()).economySeats(request.getEconomySeats())
				.businessSeats(request.getBusinessSeats()).ticketCost(request.getTicketCost())
				.mealType(request.getMealType()).status(FlightStatus.ACTIVE).build();

		Flight savedFlight = flightRepository.save(flight);

		Inventory inventory = Inventory.builder().flight(savedFlight).airlineId(request.getAirlineId())
				.flightNumber(request.getFlightNumber().trim()).fromPlace(request.getFromPlace().trim())
				.toPlace(request.getToPlace().trim()).departureTime(request.getDepartureTime())
				.arrivalTime(request.getArrivalTime()).economySeats(request.getEconomySeats())
				.businessSeats(request.getBusinessSeats()).build();

		inventoryRepository.save(inventory);

		return savedFlight.getFlightId();
	}

	@Override
	@Transactional
	public Long updateFlight(Long id, FlightCreateRequest request) {
		validateCreateRequest(request);

		Flight flight = flightRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Flight not found with id: " + id));

		flight.setFromPlace(request.getFromPlace().trim());
		flight.setToPlace(request.getToPlace().trim());
		flight.setDepartureTime(request.getDepartureTime());
		flight.setArrivalTime(request.getArrivalTime());
		flight.setTicketCost(request.getTicketCost());
		flight.setMealType(request.getMealType());
		flight.setEconomySeats(request.getEconomySeats());
		flight.setBusinessSeats(request.getBusinessSeats());

		Flight savedFlight = flightRepository.save(flight);

		Inventory inventory = inventoryRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Inventory not found for flight id: " + id));

		inventory.setFromPlace(request.getFromPlace().trim());
		inventory.setToPlace(request.getToPlace().trim());
		inventory.setDepartureTime(request.getDepartureTime());
		inventory.setArrivalTime(request.getArrivalTime());
		inventory.setEconomySeats(request.getEconomySeats());
		inventory.setBusinessSeats(request.getBusinessSeats());

		inventoryRepository.save(inventory);

		return savedFlight.getFlightId();
	}

	private void validateCreateRequest(FlightCreateRequest request) {
		validatePlace(request.getFromPlace());
		validatePlace(request.getToPlace());

		if (request.getFromPlace().trim().equalsIgnoreCase(request.getToPlace().trim())) {
			throw new IllegalArgumentException("Source and destination cannot be the same");
		} 
		if (request.getDepartureTime().isBefore(LocalDateTime.now())) {
			throw new IllegalArgumentException("Departure time cannot be in the past");
		}

		if (!request.getArrivalTime().isAfter(request.getDepartureTime())) {
			throw new IllegalArgumentException("Arrival time must be after departure time");
		}

		int totalSeats = request.getEconomySeats() + request.getBusinessSeats();
		if (totalSeats <= 0) {
			throw new IllegalArgumentException("At least one seat class must have seats");
		}
	}

	private void validatePlace(String place) {
		if (!place.trim().matches(placeRegex)) {
			throw new IllegalArgumentException(placeMessage);
		}
	}
}