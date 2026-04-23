package com.flightapp.flightservice.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightResponse {

    private Long flightId;
    private String flightNumber;
    private Long airlineId;
    private String fromPlace;
    private String toPlace;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Integer economySeats;
    private Integer businessSeats;
    private float ticketCost;
    private String status;
}