package com.flightapp.flightservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.flightapp.flightservice.enums.MealType;

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
    private BigDecimal ticketCost;
    private MealType mealType;
    private String status;
}