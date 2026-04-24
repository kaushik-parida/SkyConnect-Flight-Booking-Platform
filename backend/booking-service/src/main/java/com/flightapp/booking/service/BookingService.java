package com.flightapp.booking.service;

import java.util.List;

import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.dto.CreateBookingRequest;

public interface BookingService {
	Long createBooking(CreateBookingRequest request);
}