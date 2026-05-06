package com.flightapp.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.flightapp.booking.model.BookingStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {

	private Long bookingId;
	private String bookingReference;
	private Long flightId;
	private String userId;
	private Integer numberOfSeats;
	private LocalDateTime departureTime;
	private BigDecimal totalPrice;
	private BookingStatus status;
	private String seatClass;
	private LocalDateTime bookingTime;
	private List<PassengerResponse> passengers;
}