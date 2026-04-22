package com.flightapp.airlineservice.service;
import com.flightapp.airlineservice.dto.AirlineDTO;
import com.flightapp.airlineservice.entity.Airline;
import java.util.List;
public interface AirlineService {
	Airline registerAirline(AirlineDTO dto);
	Airline blockAirline(Long id);
	List<Airline> getAllActiveAirlines();
}
