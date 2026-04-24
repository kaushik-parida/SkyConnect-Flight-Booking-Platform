package com.flightapp.booking.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1.0/flight/booking")
public class BookingController {

	private final BookingService bookingService;

	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}

	@PostMapping
	public ResponseEntity<Long> createBooking(@Valid @RequestBody CreateBookingRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
	}
}