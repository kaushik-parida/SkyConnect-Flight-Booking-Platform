package com.flightapp.booking.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.dto.CancelBookingResponse;
import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.dto.PagedResponse;
import com.flightapp.booking.service.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1.0/flight/booking")
@Tag(name = "Booking", description = "Flight booking management endpoints")
public class BookingController {

	private final BookingService bookingService;

	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}

	@PostMapping("/{flightId}")
	@Operation(summary = "Book Ticket", description = "Creates a booking for a specific flight after validating availability")
	@ApiResponse(responseCode = "201", description = "Booking created successfully")
	@ApiResponse(responseCode = "400", description = "Validation error or flight not active")
	@ApiResponse(responseCode = "404", description = "Flight not found")
	@ApiResponse(responseCode = "409", description = "Insufficient seats or duplicate booking")
	@ApiResponse(responseCode = "503", description = "Flight service unavailable")
	public ResponseEntity<Long> createBooking(@Parameter(description = "Flight ID") @PathVariable long flightId,
			@Valid @RequestBody CreateBookingRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(flightId, request));
	}

	@GetMapping("/{bookingId}")
	@Operation(summary = "Get booking by ID", description = "Returns full booking details using the internal booking ID")
	@ApiResponse(responseCode = "200", description = "Booking found")
	@ApiResponse(responseCode = "404", description = "Booking not found")
	public ResponseEntity<BookingResponse> getBookingById(
			@Parameter(description = "Internal Booking ID") @PathVariable Long bookingId) {
		return ResponseEntity.ok(bookingService.getBookingById(bookingId));
	}

	@GetMapping("/ticket/{bookingReference}")
	@Operation(summary = "Get Booked ticket details based on PNR", description = "Returns booking details using the PNR reference")
	@ApiResponse(responseCode = "200", description = "Booking found")
	@ApiResponse(responseCode = "404", description = "Booking not found")
	public ResponseEntity<BookingResponse> getTicketByPnr(
			@Parameter(description = "PNR Reference") @PathVariable String bookingReference) {
		return ResponseEntity.ok(bookingService.getBookingByBookingReference(bookingReference));
	}

	@GetMapping("/history/{userId}")
	@Operation(summary = "Get Booked tickets history based on User ID", description = "Returns history of bookings for a user by their unique ID")
	@ApiResponse(responseCode = "200", description = "History retrieved")
	public ResponseEntity<PagedResponse<BookingResponse>> getBookingByUserId(
			@Parameter(description = "User ID") @PathVariable String userId,
			@Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
			@Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {

		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "bookingTime"));
		Page<BookingResponse> result = bookingService.getBookingsByUserId(userId, pageable);

		return ResponseEntity.ok(PagedResponse.<BookingResponse>builder().content(result.getContent())
				.page(result.getNumber()).size(result.getSize()).totalElements(result.getTotalElements())
				.totalPages(result.getTotalPages()).last(result.isLast()).build());
	}

	@PatchMapping("/cancel/{bookingReference}")
	@Operation(summary = "Cancel a booked ticket", description = "Cancels a booking using the PNR reference")
	@ApiResponse(responseCode = "200", description = "Cancelled successfully")
	@ApiResponse(responseCode = "400", description = "Cancellation not allowed (within 24h)")
	@ApiResponse(responseCode = "404", description = "Booking not found")
	public ResponseEntity<CancelBookingResponse> cancelBooking(
			@Parameter(description = "PNR Reference") @PathVariable String bookingReference,
			@Parameter(description = "User ID") @RequestParam String userId) {
		return ResponseEntity.ok(bookingService.cancelBooking(bookingReference, userId));
	}

	@PatchMapping("/cancel/id/{bookingId}")
	@Operation(summary = "Cancel booking by ID", description = "Cancels a booking using the internal booking ID")
	@ApiResponse(responseCode = "200", description = "Cancelled successfully")
	@ApiResponse(responseCode = "400", description = "Cancellation not allowed (within 24h)")
	@ApiResponse(responseCode = "404", description = "Booking not found")
	public ResponseEntity<CancelBookingResponse> cancelBookingById(
			@Parameter(description = "Internal Booking ID") @PathVariable Long bookingId,
			@Parameter(description = "User ID") @RequestParam String userId) {
		return ResponseEntity.ok(bookingService.cancelBookingById(bookingId, userId));
	}

	@GetMapping("/admin/all")
	@Operation(summary = "Get all bookings (admin)", description = "Returns paginated list of all bookings across all users")
	public ResponseEntity<PagedResponse<BookingResponse>> getAllBookings(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {

		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "bookingTime"));
		Page<BookingResponse> result = bookingService.getAllBookings(pageable);

		return ResponseEntity.ok(PagedResponse.<BookingResponse>builder().content(result.getContent())
				.page(result.getNumber()).size(result.getSize()).totalElements(result.getTotalElements())
				.totalPages(result.getTotalPages()).last(result.isLast()).build());
	}
}