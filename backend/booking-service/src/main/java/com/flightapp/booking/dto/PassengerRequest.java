package com.flightapp.booking.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PassengerRequest {

	@NotBlank(message = "First name is required")
	private String firstName;

	@NotBlank(message = "Last name is required")
	private String lastName;

	private String passportNumber;

	private LocalDate dateOfBirth;

	private String mealPreference;

}
