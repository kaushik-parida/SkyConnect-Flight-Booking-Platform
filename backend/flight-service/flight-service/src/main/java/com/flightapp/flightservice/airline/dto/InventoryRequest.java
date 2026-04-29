package com.flightapp.flightservice.airline.dto;

import java.util.Date;

import lombok.Data;

@Data
public class InventoryRequest {
	private Long airlineId;
	private String flightNumber;
	private String source;
	private String destination;

	private Date departureTime;
	private Date arrivalTime;

	private int economySeats;
	private int businessSeats;

}
