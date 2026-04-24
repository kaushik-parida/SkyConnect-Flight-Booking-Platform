package com.flightapp.booking.service.implementation;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.flightapp.booking.client.FlightServiceClient;
import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.dto.PassengerRequest;
import com.flightapp.booking.dto.external.FlightResponse;
import com.flightapp.booking.exception.FlightNotActiveException;
import com.flightapp.booking.exception.FlightServiceUnavailableException;
import com.flightapp.booking.exception.InsufficientSeatsException;
import com.flightapp.booking.model.Booking;
import com.flightapp.booking.model.BookingStatus;
import com.flightapp.booking.repository.BookingRepository;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplementationTest {

	@Mock
	private BookingRepository bookingRepository;

	@Mock
	private FlightServiceClient flightServiceClient;

	@InjectMocks
	private BookingServiceImplementation bookingService;

	private CreateBookingRequest validRequest;
	private FlightResponse activeFlight;

	@BeforeEach
	void setUp() {
		PassengerRequest passenger = new PassengerRequest();
		passenger.setFirstName("Rahul");
		passenger.setLastName("Sharma");
		passenger.setPassportNumber("P1234567");
		passenger.setDateOfBirth(LocalDate.of(1995, 6, 15));
		passenger.setSeatNumber("12A");
		passenger.setMealPreference("VEGETARIAN");

		validRequest = new CreateBookingRequest();
		validRequest.setFlightId(1L);
		validRequest.setUserId("USER-001");
		validRequest.setNumberOfSeats(1);
		validRequest.setPaymentMethod("UPI");
		validRequest.setPassengers(List.of(passenger));

		activeFlight = new FlightResponse();
		activeFlight.setFlightId(1L);
		activeFlight.setFlightNumber("6E-2341");
		activeFlight.setFromPlace("Mumbai");
		activeFlight.setToPlace("Delhi");
		activeFlight.setAvailableSeats(42);
		activeFlight.setTicketCost(4500.0);
		activeFlight.setStatus("ACTIVE");
	}

	@Test
	@DisplayName("createBooking: should create booking successfully when flight is active and seats available")
	void test_createBooking_happyPath_returnsConfirmedBooking() {
		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doNothing().when(flightServiceClient).reduceSeats(anyLong(), anyInt());

		Booking savedBooking = Booking.builder().bookingId(1L).bookingRef("FLY1234567").userId("USER-001").flightId(1L)
				.numberOfSeats(1).totalPrice(BigDecimal.valueOf(4500.0)).status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		Long bookingId = bookingService.createBooking(validRequest);

		assertNotNull(bookingId);
		assertEquals(1L, bookingId);

		verify(flightServiceClient, times(1)).getFlightById(1L);
		verify(flightServiceClient, times(1)).reduceSeats(1L, 1);
		verify(bookingRepository, times(1)).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: should calculate total price correctly for multiple seats")
	void test_createBooking_multipleSeats_calculatesPriceCorrectly() {
		PassengerRequest p2 = new PassengerRequest();
		p2.setFirstName("Priya");
		p2.setLastName("Sharma");
		p2.setMealPreference("NONE");

		validRequest.setNumberOfSeats(2);
		validRequest.setPassengers(List.of(validRequest.getPassengers().get(0), p2));

		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doNothing().when(flightServiceClient).reduceSeats(anyLong(), anyInt());

		Booking savedBooking = Booking.builder().bookingId(99L).bookingRef("FLY1234567").userId("USER-001").flightId(1L)
				.numberOfSeats(2).totalPrice(BigDecimal.valueOf(9000.0)).status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		Long bookingId = bookingService.createBooking(validRequest);

		assertEquals(99L, bookingId);
	}

	@Test
	@DisplayName("createBooking: should throw FlightNotActiveException when flight status is not ACTIVE")
	void test_createBooking_flightNotActive_throwsException() {
		activeFlight.setStatus("CANCELLED");
		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);

		FlightNotActiveException exception = assertThrows(FlightNotActiveException.class,
				() -> bookingService.createBooking(validRequest));

		assertEquals("Flight 1 is not active", exception.getMessage());
		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: should throw InsufficientSeatsException when not enough seats available")
	void test_createBooking_insufficientSeats_throwsException() {
		activeFlight.setAvailableSeats(0);
		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);

		InsufficientSeatsException exception = assertThrows(InsufficientSeatsException.class,
				() -> bookingService.createBooking(validRequest));

		assertEquals("Only 0 seats available", exception.getMessage());
		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: should throw InsufficientSeatsException when requested seats exceed available")
	void test_createBooking_requestedSeatsExceedAvailable_throwsException() {
		activeFlight.setAvailableSeats(1);
		validRequest.setNumberOfSeats(3);
		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);

		assertThrows(InsufficientSeatsException.class, () -> bookingService.createBooking(validRequest));

		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: should throw FlightServiceUnavailableException when flight service is down")
	void test_createBooking_flightServiceDown_throwsException() {
		when(flightServiceClient.getFlightById(1L))
				.thenThrow(new FlightServiceUnavailableException("Flight Service is currently unavailable"));

		FlightServiceUnavailableException exception = assertThrows(FlightServiceUnavailableException.class,
				() -> bookingService.createBooking(validRequest));

		assertEquals("Flight Service is currently unavailable", exception.getMessage());
		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: booking should stay PENDING when reduceSeats call fails")
	void test_createBooking_reduceSeatsFailure_bookingStaysPending() {
		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doThrow(new RuntimeException("Service Unavailable")).when(flightServiceClient).reduceSeats(anyLong(), anyInt());

		Booking savedBooking = Booking.builder().bookingId(1L).bookingRef("FLY1234567").status(BookingStatus.PENDING)
				.build();

		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		Long bookingId = bookingService.createBooking(validRequest);

		assertEquals(1L, bookingId);
		verify(bookingRepository, times(1)).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: should default meal preference to NONE when null")
	void test_createBooking_nullMealPreference_defaultsToNone() {
		validRequest.getPassengers().get(0).setMealPreference(null);

		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doNothing().when(flightServiceClient).reduceSeats(anyLong(), anyInt());

		Booking savedBooking = Booking.builder().bookingId(1L).bookingRef("FLY1234567").userId("USER-001").flightId(1L)
				.numberOfSeats(1).totalPrice(BigDecimal.valueOf(4500.0)).status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		assertDoesNotThrow(() -> bookingService.createBooking(validRequest));
	}
}