package com.flightapp.flightservice.service;

import com.flightapp.flightservice.dto.FlightCreateRequest;
import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class FlightCreateServiceImplementation implements FlightCreateService{
    private final FlightRepository flightRepository;
    @Value("${flight.place.regex}")
    private String placeRegex;
    @Value("${flight.place.message}")
    private String placeMessage;
    @Override
    public Long createFlight(FlightCreateRequest request){
        validateCreateRequest(request);
        if(flightRepository.existsByFlightNumberIgnoreCase(request.getFlightNumber().trim())) {
            throw new IllegalArgumentException("flight number already exists");
        }
        Flight flight =Flight.builder()
                .flightNumber(request.getFlightNumber().trim())
                .airlineId(request.getAirlineId())
                .fromPlace(request.getFromPlace().trim())
                .toPlace(request.getToPlace().trim())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .economySeats(request.getEconomySeats())
                .businessSeats(request.getBusinessSeats())
                .ticketCost(request.getTicketCost())
                .mealType(request.getMealType())
                .status(FlightStatus.ACTIVE)
                .build();
        Flight savedFlight = flightRepository.save(flight);
        return savedFlight.getFlightId();
    }
    private void validateCreateRequest(FlightCreateRequest request){
        validatePlace(request.getFromPlace()); 
        validatePlace(request.getToPlace());
        if (request.getFromPlace().trim().equalsIgnoreCase(request.getToPlace().trim())) {
            throw new IllegalArgumentException("Source and destination cannot be the same");
        }
        if (!request.getArrivalTime().isAfter(request.getDepartureTime())) {
            throw new IllegalArgumentException("Arrival time must be after departure time");
        }
        int totalSeats=request.getEconomySeats()+request.getBusinessSeats();
        if (totalSeats<= 0){
            throw new IllegalArgumentException("At least one seat class must have seats");
        }
    }
    private void validatePlace(String place) {
        if (!place.trim().matches(placeRegex)) {
            throw new IllegalArgumentException(placeMessage);
        }
    }
}