package com.flightapp.airlineservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flightapp.airlineservice.dto.AirlineDTO;
import com.flightapp.airlineservice.entity.Airline;
import com.flightapp.airlineservice.service.AirlineService;

@RestController
@RequestMapping("/api/v1.0/flight/airline")
@CrossOrigin
public class AirlineController {
	@Autowired
	private AirlineService service;
	@PostMapping
	public Airline register(@RequestBody AirlineDTO dto) {
		return service.registerAirline(dto);
	}
	@PutMapping
	public Airline block(@PathVariable Long id) {
		return service.blockAirline(id);
	}
	@GetMapping
	public List<Airline> getAll(){
		return service.getAllActiveAirlines();
	}

}
