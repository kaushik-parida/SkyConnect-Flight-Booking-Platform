package com.flightapp.airlineservice.dto;

import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class AirlineResponse {

	private Long airlineId;
	private String airlineName;
	private String airlineCode;
	private boolean isBlocked;
}