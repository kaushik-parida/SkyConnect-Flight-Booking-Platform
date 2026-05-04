package com.flightapp.booking.dto.external;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class FlightResponse {

	private Long flightId;
	private String flightNumber;
	private Long airlineId;
	private String fromPlace;
	private String toPlace;

	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime departureTime;

	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime arrivalTime;

	private Integer economySeats;
	private Integer businessSeats;
	private BigDecimal ticketCost;
	private String status;
}