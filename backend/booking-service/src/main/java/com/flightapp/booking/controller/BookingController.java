package com.flightapp.booking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.service.BookingService;

@RestController
@RequestMapping("/api/v1.0/flight/booking")
public class BookingController {

	private final BookingService bookingService;

	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}

	@PostMapping
	public BookingResponse createBooking(@RequestBody CreateBookingRequest request) {
		return bookingService.createBooking(request);
	}

	@GetMapping
	public List<BookingResponse> getAllBookings() {
		return bookingService.getAllBookings();
	}
}