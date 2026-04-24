package com.flightapp.booking.dto.external;

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
	private Integer availableSeats;
	private Double ticketCost;
	private String status;
}