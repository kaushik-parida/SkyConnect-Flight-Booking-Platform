package com.flightapp.booking.model;

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
public class Booking {

	private Long bookingId;
	private Long flightId;
	private Integer seatCount;
	private String bookingStatus;
}