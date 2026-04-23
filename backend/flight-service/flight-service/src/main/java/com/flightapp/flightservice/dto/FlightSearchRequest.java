package com.flightapp.flightservice.dto;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class FlightSearchRequest {
	 @NotBlank
	    private String from;
	    @NotBlank
	    private String to;
	    @NotNull
	    @JsonFormat(pattern="yyyy-MM-dd")
	    private LocalDate date;
	}
