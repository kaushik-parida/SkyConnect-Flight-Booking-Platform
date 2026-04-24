package com.flightapp.flightservice.controller;

import com.flightapp.flightservice.dto.FlightCreateRequest;
import com.flightapp.flightservice.service.FlightCreateService;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/v1.0/flights")
@RequiredArgsConstructor
public class FlightCreateController {
    private final FlightCreateService flightCreateService;
    @PostMapping
    public ResponseEntity<Long> createFlight(@Valid @RequestBody FlightCreateRequest request){
        Long flightId =flightCreateService.createFlight(request);
        return ResponseEntity.status(201).body(flightId);
    }
}