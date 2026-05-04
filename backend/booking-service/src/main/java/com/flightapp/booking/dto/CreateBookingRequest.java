package com.flightapp.booking.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateBookingRequest {

	@NotBlank(message = "User ID is required")
	private String userId;

	@NotNull(message = "Payment method is required")
	private String paymentMethod;

	@Valid
	@NotNull(message = "Passenger details are required")
	@Size(min = 1, message = "At least 1 passenger is required")
	private List<PassengerRequest> passengers;
}