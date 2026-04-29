package com.flightapp.flightservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlightInventoryStatusServiceImpl implements FlightInventoryStatusService {
	private final FlightRepository flightRepository;

	@Override
	public int updateFlightsByAirlineStatus(Long airlineId, String airlineStatus) {
		FlightStatus flightStatus = mapAirlineStatusToFlightstatus(airlineStatus);
		List<Flight> flights = flightRepository.findByAirlineId(airlineId);
		flights.forEach(flight -> flight.setStatus(flightStatus));
		flightRepository.saveAll(flights);
		return flights.size();
	}

	private FlightStatus mapAirlineStatusToFlightstatus(String airlineStatus) {
		if ("BLOCKED".equalsIgnoreCase(airlineStatus)) {
			return FlightStatus.INACTIVE;
		}
		if ("ACTIVE".equalsIgnoreCase(airlineStatus)) {
			return FlightStatus.ACTIVE;
		}
		throw new IllegalArgumentException("Invalid airline status");
	}

}
