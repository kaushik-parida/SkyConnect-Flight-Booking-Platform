package com.flightapp.authservice.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class SignupResponse {

	private UUID userId;
	private String email;
	private String role;
}