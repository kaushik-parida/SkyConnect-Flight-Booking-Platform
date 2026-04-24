package com.flightapp.booking.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
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
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.dto.PassengerRequest;
import com.flightapp.booking.exception.FlightNotActiveException;
import com.flightapp.booking.exception.FlightServiceUnavailableException;
import com.flightapp.booking.exception.InsufficientSeatsException;
import com.flightapp.booking.model.BookingStatus;
import com.flightapp.booking.service.BookingService;

@WebMvcTest(BookingController.class)
class BookingControllerTest {

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
		passenger.setSeatNumber("12A");
		passenger.setMealPreference("VEGETARIAN");

		CreateBookingRequest request = new CreateBookingRequest();
		request.setFlightId(1L);
		request.setUserId("USER-001");
		request.setNumberOfSeats(1);
		request.setPaymentMethod("UPI");
		request.setPassengers(List.of(passenger));
		return request;
	}

	private BookingResponse buildBookingResponse() {
		return BookingResponse.builder().bookingId(1L).bookingRef("FLY1234567").flightId(1L).userId("USER-001")
				.numberOfSeats(1).totalPrice(BigDecimal.valueOf(4500.0)).status(BookingStatus.CONFIRMED)
				.bookingTime(LocalDateTime.now()).passengers(List.of()).build();
	}

	@Test
	@DisplayName("POST /booking: should return 201 Created with booking response")
	void test_createBooking_validRequest_returns201() throws Exception {
		when(bookingService.createBooking(any(CreateBookingRequest.class))).thenReturn(1L);

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest())))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$").value(1));
	}

	@Test
	@DisplayName("POST /booking: should return 400 when flightId is missing")
	void test_createBooking_missingFlightId_returns400() throws Exception {
		CreateBookingRequest request = buildValidRequest();
		request.setFlightId(null);

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("flightId: Flight ID is required"));
	}

	@Test
	@DisplayName("POST /booking: should return 400 when passengers list is missing")
	void test_createBooking_missingPassengers_returns400() throws Exception {
		CreateBookingRequest request = buildValidRequest();
		request.setPassengers(null);

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("passengers: Passenger details are required"));
	}

	@Test
	@DisplayName("POST /booking: should return 409 when seats are insufficient")
	void test_createBooking_insufficientSeats_returns409() throws Exception {
		when(bookingService.createBooking(any(CreateBookingRequest.class)))
				.thenThrow(new InsufficientSeatsException("Only 0 seats available"));

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Only 0 seats available"));
	}

	@Test
	@DisplayName("POST /booking: should return 503 when flight service is unavailable")
	void test_createBooking_flightServiceUnavailable_returns503() throws Exception {
		when(bookingService.createBooking(any(CreateBookingRequest.class)))
				.thenThrow(new FlightServiceUnavailableException("Flight Service is currently unavailable"));

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest())))
				.andExpect(status().isServiceUnavailable()).andExpect(jsonPath("$.status").value(503))
				.andExpect(jsonPath("$.message").value("Flight Service is currently unavailable"));
	}

	@Test
	@DisplayName("POST /booking: should return 400 when flight is not active")
	void test_createBooking_flightNotActive_returns400() throws Exception {
		when(bookingService.createBooking(any(CreateBookingRequest.class)))
				.thenThrow(new FlightNotActiveException("Flight 1 is not active"));

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Flight 1 is not active"));
	}
}