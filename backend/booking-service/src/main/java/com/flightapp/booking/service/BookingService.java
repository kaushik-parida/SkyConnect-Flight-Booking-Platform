package com.flightapp.booking.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.dto.CancelBookingResponse;
import com.flightapp.booking.dto.CreateBookingRequest;

public interface BookingService {
	Long createBooking(CreateBookingRequest request);

	BookingResponse getBookingById(Long bookingId);

	Page<BookingResponse> getBookingsByUserId(String userId, Pageable pageable);

	Page<BookingResponse> getAllBookings(Pageable pageable);

	CancelBookingResponse cancelBooking(Long bookingId, String userId);
}