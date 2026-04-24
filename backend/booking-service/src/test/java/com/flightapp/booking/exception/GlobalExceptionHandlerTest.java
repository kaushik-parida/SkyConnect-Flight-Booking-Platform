package com.flightapp.booking.exception;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import com.flightapp.booking.controller.BookingController;
import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.dto.PassengerRequest;
import com.flightapp.booking.service.BookingService;

@WebMvcTest(BookingController.class)
public class GlobalExceptionHandlerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private BookingService bookingService;

	private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

	private CreateBookingRequest buildValidRequest() {
		PassengerRequest passenger = new PassengerRequest();
		passenger.setFirstName("Rahul");
		passenger.setLastName("Sharma");
		passenger.setMealPreference("NONE");

		CreateBookingRequest request = new CreateBookingRequest();
		request.setFlightId(1L);
		request.setUserId("USER-001");
		request.setNumberOfSeats(1);
		request.setPaymentMethod("UPI");
		request.setPassengers(List.of(passenger));
		return request;
	}

	@Test
	@DisplayName("GlobalExceptionHandler: FlightNotFoundException should return 404")
	void test_handleFlightNotFound_returns404() throws Exception {
		when(bookingService.createBooking(any()))
				.thenThrow(new FlightNotFoundException("Flight not found with id: 999"));

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Flight not found with id: 999"))
				.andExpect(jsonPath("$.timestamp").exists());
	}

	@Test
	@DisplayName("GlobalExceptionHandler: InsufficientSeatsException should return 409")
	void test_handleInsufficientSeats_returns409() throws Exception {
		when(bookingService.createBooking(any())).thenThrow(new InsufficientSeatsException("Only 0 seats available"));

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Only 0 seats available"));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: FlightNotActiveException should return 400")
	void test_handleFlightNotActive_returns400() throws Exception {
		when(bookingService.createBooking(any())).thenThrow(new FlightNotActiveException("Flight 1 is not active"));

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Flight 1 is not active"));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: FlightServiceUnavailableException should return 503")
	void test_handleFlightServiceUnavailable_returns503() throws Exception {
		when(bookingService.createBooking(any()))
				.thenThrow(new FlightServiceUnavailableException("Flight Service is currently unavailable"));

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest())))
				.andExpect(status().isServiceUnavailable()).andExpect(jsonPath("$.status").value(503))
				.andExpect(jsonPath("$.message").value("Flight Service is currently unavailable"));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: Validation failure should return 400 with field message")
	void test_handleValidationError_returns400WithFieldMessage() throws Exception {
		CreateBookingRequest request = buildValidRequest();
		request.setFlightId(null);

		mockMvc.perform(post("/api/v1.0/flight/booking").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("flightId: Flight ID is required"))
				.andExpect(jsonPath("$.timestamp").exists()).andExpect(jsonPath("$.path").exists());
	}
}