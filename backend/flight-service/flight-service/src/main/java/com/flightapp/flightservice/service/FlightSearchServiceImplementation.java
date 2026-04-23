package com.flightapp.flightservice.service;
import com.flightapp.flightservice.dto.FlightResponse;
import com.flightapp.flightservice.dto.FlightSearchRequest;
import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.model.Flight;
import com.flightapp.flightservice.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class FlightSearchServiceImplementation implements FlightSearchService {
    private final FlightRepository flightRepository;
    @Override
    public List<FlightResponse> searchFlights(FlightSearchRequest request) {
        List<Flight> flights = flightRepository.findByFromPlaceIgnoreCaseAndToPlaceIgnoreCaseAndStatus(
                        request.getFromPlace().trim(),
                        request.getToPlace().trim(),
                        FlightStatus.ACTIVE
                );
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