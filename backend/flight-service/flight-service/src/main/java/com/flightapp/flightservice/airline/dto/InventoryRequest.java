package com.flightapp.flightservice.airline.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.flightapp.flightservice.constant.AppConstants;

import lombok.Data;

@Data
public class InventoryRequest {
	private Long airlineId;
	private String flightNumber;
	private String fromPlace;
	private String toPlace;

	@JsonFormat(pattern = AppConstants.DATE_TIME_FORMAT)
	private LocalDateTime departureTime;

	@JsonFormat(pattern = AppConstants.DATE_TIME_FORMAT)
	private LocalDateTime arrivalTime;

	private int economySeats;
	private int businessSeats;

}
