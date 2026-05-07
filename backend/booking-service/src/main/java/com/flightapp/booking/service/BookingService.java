package com.flightapp.booking.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.dto.CancelBookingResponse;
import com.flightapp.booking.dto.CreateBookingRequest;

public interface BookingService {
	Long createBooking(Long flightId, CreateBookingRequest request);

	BookingResponse getBookingById(Long bookingId);

	Page<BookingResponse> getBookingsByUserId(String userId, Pageable pageable);

	BookingResponse getBookingByBookingReference(String bookingReference);

	Page<BookingResponse> getAllBookings(Pageable pageable);

	CancelBookingResponse cancelBooking(String bookingReference, String userId);

	CancelBookingResponse cancelPassengers(String bookingReference, java.util.List<Long> passengerIds, String userId);

	CancelBookingResponse cancelBookingById(Long bookingId, String userId);
}