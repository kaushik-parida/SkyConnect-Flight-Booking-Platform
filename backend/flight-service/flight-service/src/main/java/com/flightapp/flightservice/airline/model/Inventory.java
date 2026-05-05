package com.flightapp.flightservice.airline.model;

import java.time.LocalDateTime;
import java.util.Date;

import com.flightapp.flightservice.model.Flight;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
	@Id
	private Long id;

	@OneToOne
	@MapsId
	@JoinColumn(name = "flight_id")
	private Flight flight;

	private Long airlineId;
	private String flightNumber;
	private String fromPlace;
	private String toPlace;

	private LocalDateTime departureTime;
	private LocalDateTime arrivalTime;

	private Integer economySeats;
	private Integer businessSeats;
}
