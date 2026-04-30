package com.flightapp.authservice.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class UserInfo {

	private UUID userId;
	private String fullName;
	private String email;
}