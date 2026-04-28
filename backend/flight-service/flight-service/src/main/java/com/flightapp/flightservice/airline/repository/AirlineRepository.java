package com.flightapp.flightservice.airline.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flightapp.flightservice.airline.model.Airline;

public interface AirlineRepository extends JpaRepository<Airline, Long> {

}
