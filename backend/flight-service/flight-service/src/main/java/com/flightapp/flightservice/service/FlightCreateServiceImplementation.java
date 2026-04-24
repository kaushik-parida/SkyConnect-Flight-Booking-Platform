package com.flightapp.flightservice.service;

import com.flightapp.flightservice.dto.FlightCreateRequest;
import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class FlightCreateServiceImplementation implements FlightCreateService{
    private final FlightRepository flightRepository;
    @Override
    public Long createFlight(FlightCreateRequest request){
        validateCreateRequest(request);
        if(flightRepository.existsByFlightNumberIgnoreCase(request.getFlightNumber().trim())) {
            throw new IllegalArgumentException("flight already exists");
        }
        Flight flight =Flight.builder()
                .flightNumber(request.getFlightNumber().trim())
                .airlineId(request.getAirlineId())
                .fromPlace(request.getFrom().trim())
                .toPlace(request.getTo().trim())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .economySeats(request.getEconomySeats())
                .businessSeats(request.getBusinessSeats())
                .availableSeats(request.getAvailableSeats())
                .ticketCost(request.getTicketCost())
                .mealType(request.getMealType())
                .status(FlightStatus.ACTIVE)
                .build();
        Flight savedFlight = flightRepository.save(flight);
        return savedFlight.getFlightId();
    }
    private void validateCreateRequest(FlightCreateRequest request){
        if (request.getFrom().trim().equalsIgnoreCase(request.getTo().trim())) {
            throw new IllegalArgumentException("from and to cannot be identical");
        }
        if (!request.getArrivalTime().isAfter(request.getDepartureTime())) {
            throw new IllegalArgumentException();
        }
        int totalSeats=request.getEconomySeats()+request.getBusinessSeats();
        if (totalSeats<= 0){
            throw new IllegalArgumentException();
        }
        if (request.getAvailableSeats()>totalSeats){
            throw new IllegalArgumentException();
        }
    }
}