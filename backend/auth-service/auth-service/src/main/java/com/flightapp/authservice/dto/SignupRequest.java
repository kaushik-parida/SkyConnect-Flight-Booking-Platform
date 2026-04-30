package com.flightapp.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SignupRequest {

	@NotBlank
	private String fullName;

	@Email
	@NotBlank
	private String email;

	@NotBlank
	private String password;

	private String phoneNumber;

	@Pattern(regexp = "MALE|FEMALE", message = "Gender must be MALE or FEMALE")
	private String gender;

	private String dateOfBirth;
}