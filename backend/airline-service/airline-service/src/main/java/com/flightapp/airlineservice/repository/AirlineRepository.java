package com.flightapp.airlineservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flightapp.airlineservice.entity.Airline;
public interface AirlineRepository extends JpaRepository<Airline, Long> {

	Optional<Airline> findByAirlineCode(String airlineCode);
}