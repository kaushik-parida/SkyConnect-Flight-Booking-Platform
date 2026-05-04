package com.flightapp.booking.exception;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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
		request.setUserId("USER-001");
		request.setPaymentMethod("UPI");
		request.setPassengers(List.of(passenger));
		request.setSeatClass("ECONOMY");
		return request;
	}

	@Test
	@DisplayName("GlobalExceptionHandler: BookingNotFoundException should return 404")
	void test_handleBookingNotFound_returns404() throws Exception {
		when(bookingService.getBookingById(999L)).thenThrow(new BookingNotFoundException("Booking not found"));

		mockMvc.perform(get("/api/v1.0/flight/booking/999")).andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404)).andExpect(jsonPath("$.message").value("Booking not found"));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: FlightNotFoundException should return 404")
	void test_handleFlightNotFound_returns404() throws Exception {
		when(bookingService.createBooking(eq(999L), any()))
				.thenThrow(new FlightNotFoundException("Flight not found with id: 999"));

		mockMvc.perform(post("/api/v1.0/flight/booking/999").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: InsufficientSeatsException should return 409")
	void test_handleInsufficientSeats_returns409() throws Exception {
		when(bookingService.createBooking(eq(1L), any()))
				.thenThrow(new InsufficientSeatsException("Only 0 seats available"));

		mockMvc.perform(post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: DuplicateBookingException should return 409")
	void test_handleDuplicateBooking_returns409() throws Exception {
		when(bookingService.createBooking(eq(1L), any()))
				.thenThrow(new DuplicateBookingException("Booking already exists"));

		mockMvc.perform(post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: FlightNotActiveException should return 400")
	void test_handleFlightNotActive_returns400() throws Exception {
		when(bookingService.createBooking(eq(1L), any()))
				.thenThrow(new FlightNotActiveException("Flight 1 is not active"));

		mockMvc.perform(post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest()))).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: CancellationNotAllowedException should return 400")
	void test_handleCancellationNotAllowed_returns400() throws Exception {
		when(bookingService.cancelBooking("FLY123", "U1")).thenThrow(new CancellationNotAllowedException("Within 24h"));

		mockMvc.perform(patch("/api/v1.0/flight/booking/cancel/FLY123").param("userId", "U1"))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.status").value(400));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: BookingAlreadyCancelledException should return 400")
	void test_handleBookingAlreadyCancelled_returns400() throws Exception {
		when(bookingService.cancelBooking("FLY123", "U1"))
				.thenThrow(new BookingAlreadyCancelledException("Already cancelled"));

		mockMvc.perform(patch("/api/v1.0/flight/booking/cancel/FLY123").param("userId", "U1"))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.status").value(400));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: UnauthorizedBookingAccessException should return 403")
	void test_handleUnauthorizedAccess_returns403() throws Exception {
		when(bookingService.cancelBooking("FLY123", "U1"))
				.thenThrow(new UnauthorizedBookingAccessException("Unauthorized"));

		mockMvc.perform(patch("/api/v1.0/flight/booking/cancel/FLY123").param("userId", "U1"))
				.andExpect(status().isForbidden()).andExpect(jsonPath("$.status").value(403));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: FlightServiceUnavailableException should return 503")
	void test_handleFlightServiceUnavailable_returns503() throws Exception {
		when(bookingService.createBooking(eq(1L), any()))
				.thenThrow(new FlightServiceUnavailableException("Service down"));

		mockMvc.perform(post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(buildValidRequest())))
				.andExpect(status().isServiceUnavailable()).andExpect(jsonPath("$.status").value(503));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: Validation failure should return 400 with field message")
	void test_handleValidationError_returns400WithFieldMessage() throws Exception {
		CreateBookingRequest request = buildValidRequest();
		request.setPaymentMethod(null);

		mockMvc.perform(post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("paymentMethod: Payment method is required"));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: HttpMessageNotReadableException should return 400")
	void test_handleHttpMessageNotReadable_returns400() throws Exception {
		mockMvc.perform(
				post("/api/v1.0/flight/booking/1").contentType(MediaType.APPLICATION_JSON).content("invalid-json"))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Malformed JSON request or invalid data format"));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: MethodArgumentTypeMismatchException should return 400")
	void test_handleTypeMismatch_returns400() throws Exception {
		mockMvc.perform(get("/api/v1.0/flight/booking/abc")).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: MethodNotSupported should return 405")
	void test_handleMethodNotSupported_returns405() throws Exception {
		mockMvc.perform(post("/api/v1.0/flight/booking/history/USER-001")).andExpect(status().isMethodNotAllowed())
				.andExpect(jsonPath("$.status").value(405));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: NoResourceFound should return 404")
	void test_handleNoResourceFound_returns404() throws Exception {
		mockMvc.perform(get("/api/v1.0/flight/booking/does/not/exist")).andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("The requested API endpoint does not exist"));
	}

	@Test
	@DisplayName("GlobalExceptionHandler: Generic Exception should return 500")
	void test_handleGenericException_returns500() throws Exception {
		when(bookingService.getBookingById(1L)).thenThrow(new RuntimeException("DB Error"));

		mockMvc.perform(get("/api/v1.0/flight/booking/1")).andExpect(status().isInternalServerError())
				.andExpect(jsonPath("$.status").value(500))
				.andExpect(jsonPath("$.message").value("An unexpected error occurred"));
	}
}
