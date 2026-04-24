package com.flightapp.booking.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBookingRequest {

	@NotNull(message = "Flight ID is required")
	private Long flightId;

	@NotBlank(message = "User ID is required")
	private String userId;

	@NotNull(message = "Number of seats is required")
	@Min(value = 1, message = "At least 1 seat must be booked")
	private Integer numberOfSeats;

	@NotNull(message = "Payment method is required")
	private String paymentMethod;

	@Valid
	@NotNull(message = "Passenger details are required")
	private List<PassengerRequest> passengers;
}