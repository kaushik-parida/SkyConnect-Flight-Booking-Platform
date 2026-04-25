package com.flightapp.airlineservice.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.flightapp.airlineservice.dto.AirlineResponse;
import com.flightapp.airlineservice.dto.CreateAirlineRequest;
import com.flightapp.airlineservice.entity.Airline;
import com.flightapp.airlineservice.exception.ResourceNotFoundException;
import com.flightapp.airlineservice.repository.AirlineRepository;
import com.flightapp.airlineservice.service.AirlineService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AirlineServiceImpl implements AirlineService {

	private final AirlineRepository airlineRepository;

	@Override
	public AirlineResponse createAirline(CreateAirlineRequest request) {

		airlineRepository.findByAirlineCode(request.getAirlineCode()).ifPresent(a -> {
			throw new RuntimeException("Airline code already exists");
		});

		Airline airline = Airline.builder().airlineName(request.getAirlineName()).airlineCode(request.getAirlineCode())
				.logoUrl(request.getLogoUrl()).contactEmail(request.getContactEmail())
				.contactNumber(request.getContactNumber()).isBlocked(false).createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now()).build();

		Airline saved = airlineRepository.save(airline);

		return AirlineResponse.builder().airlineId(saved.getAirlineId()).airlineName(saved.getAirlineName())
				.airlineCode(saved.getAirlineCode()).isBlocked(saved.isBlocked()).build();
	}

	@Override
	public List<AirlineResponse> getAllAirlines() {

		List<Airline> airlines = airlineRepository.findAll();

		return airlines.stream().map(a -> AirlineResponse.builder().airlineId(a.getAirlineId())
				.airlineName(a.getAirlineName()).airlineCode(a.getAirlineCode()).isBlocked(a.isBlocked()).build())
				.toList();
	}

	@Override
	public AirlineResponse getAirlineById(Long id) {

		Airline airline = airlineRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Airline not found with id: " + id));

		return AirlineResponse.builder().airlineId(airline.getAirlineId()).airlineName(airline.getAirlineName())
				.airlineCode(airline.getAirlineCode()).isBlocked(airline.isBlocked()).build();
	}
}