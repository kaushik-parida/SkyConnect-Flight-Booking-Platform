package com.flightapp.flightservice.airline.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AirlineRequest {

	@NotBlank
	private String name;

}
