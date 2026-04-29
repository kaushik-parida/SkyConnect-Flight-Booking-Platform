package com.flightapp.booking.dto.external;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class FlightResponse {

	private Long flightId;
	private String flightNumber;
	private Long airlineId;
	private String fromPlace;
	private String toPlace;
	private String departureTime;
	private String arrivalTime;
	private Integer economySeats;
	private Integer businessSeats;
	private BigDecimal ticketCost;
	private String status;
}