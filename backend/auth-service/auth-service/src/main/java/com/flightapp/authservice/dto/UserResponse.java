package com.flightapp.authservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

	private String userId;
	private String email;
	private String fullName;
	private String role;
	private boolean enabled;
}