package com.flightapp.booking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {
	private Long bookingId;
	private String status;
}