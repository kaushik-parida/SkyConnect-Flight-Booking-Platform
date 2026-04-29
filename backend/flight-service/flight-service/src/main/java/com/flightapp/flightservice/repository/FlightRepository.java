package com.flightapp.flightservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.model.Flight;

public interface FlightRepository extends JpaRepository<Flight, Long> {
	List<Flight> findByFromPlaceIgnoreCaseAndToPlaceIgnoreCaseAndDepartureTimeBetweenAndStatus(String fromPlace,
			String toPlace, LocalDateTime start, LocalDateTime end, FlightStatus status);

	boolean existsByFlightNumberIgnoreCase(String flightNumber);

	List<Flight> findByAirlineId(Long airlineId);
}