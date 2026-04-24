package com.flightapp.authservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserInfo {

	private Long userId;
	private String fullName;
	private String email;
}