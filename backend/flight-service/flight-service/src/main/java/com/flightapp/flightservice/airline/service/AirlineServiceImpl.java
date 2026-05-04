package com.flightapp.flightservice.airline.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.flightapp.flightservice.airline.dto.AirlineRequest;
import com.flightapp.flightservice.airline.enums.AirlineStatus;
import com.flightapp.flightservice.airline.model.Airline;
import com.flightapp.flightservice.airline.repository.AirlineRepository;
import com.flightapp.flightservice.service.FlightInventoryStatusService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AirlineServiceImpl implements AirlineService {

	private final AirlineRepository airlineRepository;
	private final FlightInventoryStatusService flightInventoryStatusService;

	@Override
	public Long createAirline(AirlineRequest request) {
		Airline airline = Airline.builder().name(request.getName().trim()).status(AirlineStatus.ACTIVE).build();

		return airlineRepository.save(airline).getAirlineId();
	}

	@Override
	public void blockAirline(Long id, String status) {
		Airline airline = airlineRepository.findById(id).orElseThrow(() -> new RuntimeException("Airline not found"));

		AirlineStatus airlineStatus = AirlineStatus.valueOf(status.replace("\"", "").trim().toUpperCase());

		airline.setStatus(airlineStatus);
		airlineRepository.save(airline);
		flightInventoryStatusService.updateFlightsByAirlineStatus(id, airlineStatus.name());

	}

	@Override
	public List<Airline> getAllAirlines() {
		return airlineRepository.findAll();
	}
}