package com.flightapp.authservice.dto;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SignupResponse {

	private UUID userId;
	private String email;
	private String role;
}