package com.flightapp.authservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SignupResponse {

	private Long userId;
	private String email;
	private String role;
}