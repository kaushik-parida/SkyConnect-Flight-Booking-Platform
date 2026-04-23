package com.flightapp.flightservice.service;
import com.flightapp.flightservice.dto.FlightResponse;
import com.flightapp.flightservice.dto.FlightSearchRequest;
import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class FlightSearchServiceImplementation implements FlightSearchService {
    private final FlightRepository flightRepository;
    @Override
    public List<FlightResponse> searchFlights(FlightSearchRequest request) {
    	if(request.getFrom().trim().equalsIgnoreCase(request.getTo().trim())) {
    		throw new RuntimeException("Source and destination cant be the same");
    	}
    	if (request.getDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Departure date cannot be in the past");
        }
    	LocalDateTime start = request.getDate().atStartOfDay();
    	LocalDateTime end = request.getDate().atTime(23, 59,59);
       
    	List<Flight> flights = flightRepository.findByFromPlaceIgnoreCaseAndToPlaceIgnoreCaseAndDepartureTimeBetweenAndStatus(
                        request.getFrom().trim(),
                        request.getTo().trim(),
                        start,
                        end,
                        FlightStatus.ACTIVE
                );
    	if(flights.isEmpty()) {
    		throw new RuntimeException("Noflights found for given route and date");
    	}
        return flights.stream().map(this::mapToResponse).toList();
    }
    private FlightResponse mapToResponse(Flight flight) {
        return FlightResponse.builder()
                .flightId(flight.getFlightId())
                .flightNumber(flight.getFlightNumber())
                .airlineId(flight.getAirlineId())
                .fromPlace(flight.getFromPlace())
                .toPlace(flight.getToPlace())
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .economySeats(flight.getEconomySeats())
                .businessSeats(flight.getBusinessSeats())
                .ticketCost(flight.getTicketCost())
                .status(flight.getStatus().name())
                .build();
    }
}