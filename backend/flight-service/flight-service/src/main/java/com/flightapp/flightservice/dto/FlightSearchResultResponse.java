package com.flightapp.flightservice.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightSearchResultResponse {
	private List<FlightResponse> onwardFlights;
	private List<FlightResponse> returnFlights;
}
