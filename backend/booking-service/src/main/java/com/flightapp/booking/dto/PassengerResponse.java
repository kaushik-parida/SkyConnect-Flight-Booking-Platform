package com.flightapp.booking.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PassengerResponse {

	private Long passengerId;
	private String firstName;
	private String lastName;
	private String passportNumber;
	private LocalDate dateOfBirth;
	private String mealPreference;
}