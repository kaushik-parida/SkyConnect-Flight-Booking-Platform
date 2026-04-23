package com.flightapp.booking.dto;

import lombok.Data;

@Data
public class CreateBookingRequest {
	private Long flightId;
	private Integer seatCount;
}