package com.flightapp.flightservice.airline.dto;

import lombok.Data;

@Data
public class InventoryRequest {
	private Long airlineId;
	private String flightNumber;
	private String source;
	private String destination;

	private String departureTime;
	private String arrivalTime;

	private int economySeats;
	private int businessSeats;

}
