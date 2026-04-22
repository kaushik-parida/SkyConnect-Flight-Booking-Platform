package com.flightapp.booking.service.implementation;

import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.model.Booking;
import com.flightapp.booking.service.BookingService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookingServiceImplementation implements BookingService {

	private final List<Booking> bookingList = new ArrayList<>();
	private Long idCounter = 1L;

	@Override
	public BookingResponse createBooking(CreateBookingRequest request) {

		Booking booking = Booking.builder().bookingId(idCounter++).flightId(request.getFlightId())
				.seatCount(request.getSeatCount()).bookingStatus("CREATED").build();

		bookingList.add(booking);

		return BookingResponse.builder().bookingId(booking.getBookingId()).status(booking.getBookingStatus()).build();
	}

	@Override
	public List<BookingResponse> getAllBookings() {

		List<BookingResponse> responseList = new ArrayList<>();

		for (Booking booking : bookingList) {
			responseList.add(BookingResponse.builder().bookingId(booking.getBookingId())
					.status(booking.getBookingStatus()).build());
		}

		return responseList;
	}
}