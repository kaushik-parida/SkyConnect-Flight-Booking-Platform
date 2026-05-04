package com.flightapp.booking.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.dto.CancelBookingResponse;
import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.dto.PassengerRequest;
import com.flightapp.booking.exception.BookingAlreadyCancelledException;
import com.flightapp.booking.exception.BookingNotFoundException;
import com.flightapp.booking.exception.FlightNotActiveException;
import com.flightapp.booking.exception.FlightServiceUnavailableException;
import com.flightapp.booking.exception.InsufficientSeatsException;
import com.flightapp.booking.exception.UnauthorizedBookingAccessException;
import com.flightapp.booking.model.BookingStatus;
import com.flightapp.booking.service.BookingService;

@WebMvcTest(BookingController.class)
public class BookingControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private BookingService bookingService;

	private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

	private CreateBookingRequest buildValidRequest() {
		PassengerRequest passenger = new PassengerRequest();
		passenger.setFirstName("Rahul");
		passenger.setLastName("Sharma");
		passenger.setPassportNumber("P1234567");
		passenger.setMealPreference("VEGETARIAN");

		CreateBookingRequest request = new CreateBookingRequest();
		request.setUserId("USER-001");
		request.setPaymentMethod("UPI");
		request.setPassengers(List.of(passenger));
		request.setSeatClass("ECONOMY");
		return request;
	}

	private BookingResponse buildBookingResponse() {
		return BookingResponse.builder().bookingId(1L).bookingReference("FLY1234567").flightId(1L).userId("USER-001")
				.numberOfSeats(1).totalPrice(BigDecimal.valueOf(4500.0)).status(BookingStatus.CONFIRMED)
				.bookingTime(LocalDateTime.now()).passengers(List.of()).build();
	}

	@Test
	@DisplayName("POST /booking: should return 201 Created with booking response")
	void test_createBooking_validRequest_returns201() throws Exception {
		when(bookingService.createBooking(eq(1L), any(CreateBookingRequest.class))).thenReturn(1L);

		mockMvc.perform(post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isCreated())
				.andExpect(jsonPath("$").value(1));
	}

	@Test
	@DisplayName("POST /booking: should return 400 when passengers list is missing")
	void test_createBooking_missingPassengers_returns400() throws Exception {
		CreateBookingRequest request = buildValidRequest();
		request.setPassengers(null);

		mockMvc.perform(post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("passengers: Passenger details are required"));
	}

	@Test
	@DisplayName("POST /booking: should return 409 when seats are insufficient")
	void test_createBooking_insufficientSeats_returns409() throws Exception {
		when(bookingService.createBooking(eq(1L), any(CreateBookingRequest.class)))
				.thenThrow(new InsufficientSeatsException("Only 0 seats available"));

		mockMvc.perform(post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Only 0 seats available"));
	}

	@Test
	@DisplayName("POST /booking: should return 503 when flight service is unavailable")
	void test_createBooking_flightServiceUnavailable_returns503() throws Exception {
		when(bookingService.createBooking(eq(1L), any(CreateBookingRequest.class)))
				.thenThrow(new FlightServiceUnavailableException("Flight Service is currently unavailable"));

		mockMvc.perform(post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest())))
				.andExpect(status().isServiceUnavailable()).andExpect(jsonPath("$.status").value(503))
				.andExpect(jsonPath("$.message").value("Flight Service is currently unavailable"));
	}

	@Test
	@DisplayName("POST /booking: should return 400 when flight is not active")
	void test_createBooking_flightNotActive_returns400() throws Exception {
		when(bookingService.createBooking(eq(1L), any(CreateBookingRequest.class)))
				.thenThrow(new FlightNotActiveException("Flight 1 is not active"));

		mockMvc.perform(post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Flight 1 is not active"));
	}

	@Test
	@DisplayName("GET /booking/{id}: should return 200 with booking")
	void test_getBookingById_found_returns200() throws Exception {
		BookingResponse response = buildBookingResponse();
		when(bookingService.getBookingById(1L)).thenReturn(response);

		mockMvc.perform(get("/api/v1.0/flight/booking/1")).andExpect(status().isOk())
				.andExpect(jsonPath("$.bookingId").value(1))
				.andExpect(jsonPath("$.bookingReference").value("FLY1234567"))
				.andExpect(jsonPath("$.status").value("CONFIRMED"));
	}

	@Test
	@DisplayName("GET /booking/{id}: should return 404 when not found")
	void test_getBookingById_notFound_returns404() throws Exception {
		when(bookingService.getBookingById(99L))
				.thenThrow(new BookingNotFoundException("Booking not found with id: 99"));

		mockMvc.perform(get("/api/v1.0/flight/booking/99")).andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Booking not found with id: 99"));
	}

	@Test
	@DisplayName("GET /history/{userId}: should return 200 with paged bookings")
	void test_getBookingByUserId_returns200() throws Exception {
		BookingResponse booking = buildBookingResponse();
		Page<BookingResponse> page = new PageImpl<>(List.of(booking));

		when(bookingService.getBookingsByUserId(eq("USER-001"), any(Pageable.class))).thenReturn(page);

		mockMvc.perform(get("/api/v1.0/flight/booking/history/USER-001")).andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements").value(1))
				.andExpect(jsonPath("$.content[0].userId").value("USER-001"));
	}

	@Test
	@DisplayName("PATCH /cancel/{pnr}: should return 200 on successful cancellation")
	void test_cancelBooking_returns200() throws Exception {
		CancelBookingResponse cancelResponse = CancelBookingResponse.builder().bookingId(1L)
				.bookingReference("FLY1234567").status(BookingStatus.CANCELLED)
				.message("Booking cancelled successfully").cancelledAt(LocalDateTime.now()).build();

		when(bookingService.cancelBooking("FLY1234567", "USER-001")).thenReturn(cancelResponse);

		mockMvc.perform(patch("/api/v1.0/flight/booking/cancel/FLY1234567").param("userId", "USER-001"))
				.andExpect(status().isOk()).andExpect(jsonPath("$.status").value("CANCELLED"))
				.andExpect(jsonPath("$.bookingReference").value("FLY1234567"));
	}

	@Test
	@DisplayName("PATCH /cancel/id/{id}: should return 403 when unauthorized")
	void test_cancelBookingById_unauthorized_returns403() throws Exception {
		when(bookingService.cancelBookingById(1L, "USER-999"))
				.thenThrow(new UnauthorizedBookingAccessException("You are not authorized to cancel this booking"));

		mockMvc.perform(patch("/api/v1.0/flight/booking/cancel/id/1").param("userId", "USER-999"))
				.andExpect(status().isForbidden()).andExpect(jsonPath("$.status").value(403));
	}

	@Test
	@DisplayName("PATCH /cancel/id/{id}: should return 400 when already cancelled")
	void test_cancelBookingById_alreadyCancelled_returns400() throws Exception {
		when(bookingService.cancelBookingById(1L, "USER-001"))
				.thenThrow(new BookingAlreadyCancelledException("Booking FLY1234567 is already cancelled"));

		mockMvc.perform(patch("/api/v1.0/flight/booking/cancel/id/1").param("userId", "USER-001"))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.status").value(400));
	}

	@Test
	@DisplayName("GET /ticket/{pnr}: should return 200 with booking details")
	void test_getTicketByPnr_returns200() throws Exception {
		BookingResponse response = buildBookingResponse();
		when(bookingService.getBookingByBookingReference("FLY1234567")).thenReturn(response);

		mockMvc.perform(get("/api/v1.0/flight/booking/ticket/FLY1234567")).andExpect(status().isOk())
				.andExpect(jsonPath("$.bookingReference").value("FLY1234567"));
	}

	@Test
	@DisplayName("GET /admin/all: should return 200 with all bookings")
	void test_getAllBookings_returns200() throws Exception {
		BookingResponse booking = buildBookingResponse();
		Page<BookingResponse> page = new PageImpl<>(List.of(booking));
		when(bookingService.getAllBookings(any(Pageable.class))).thenReturn(page);

		mockMvc.perform(get("/api/v1.0/flight/booking/admin/all")).andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements").value(1));
	}
}
