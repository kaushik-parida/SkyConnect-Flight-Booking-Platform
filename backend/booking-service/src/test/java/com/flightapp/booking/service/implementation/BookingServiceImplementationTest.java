package com.flightapp.booking.service.implementation;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.flightapp.booking.client.FlightServiceClient;
import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.dto.CancelBookingResponse;
import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.dto.PassengerRequest;
import com.flightapp.booking.dto.external.FlightResponse;
import com.flightapp.booking.exception.BookingAlreadyCancelledException;
import com.flightapp.booking.exception.BookingNotFoundException;
import com.flightapp.booking.exception.DuplicateBookingException;
import com.flightapp.booking.exception.FlightNotActiveException;
import com.flightapp.booking.exception.FlightServiceUnavailableException;
import com.flightapp.booking.exception.InsufficientSeatsException;
import com.flightapp.booking.exception.UnauthorizedBookingAccessException;
import com.flightapp.booking.model.Booking;
import com.flightapp.booking.model.BookingStatus;
import com.flightapp.booking.model.Payment;
import com.flightapp.booking.model.PaymentStatus;
import com.flightapp.booking.model.SeatClass;
import com.flightapp.booking.repository.BookingRepository;

@ExtendWith(MockitoExtension.class)
public class BookingServiceImplementationTest {

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
		passenger.setMealPreference("VEGETARIAN");

		validRequest = new CreateBookingRequest();
		validRequest.setUserId("USER-001");
		validRequest.setPaymentMethod("UPI");
		validRequest.setPassengers(List.of(passenger));
		validRequest.setSeatClass("ECONOMY");

		activeFlight = new FlightResponse();
		activeFlight.setEconomySeats(42);
		activeFlight.setBusinessSeats(10);
		activeFlight.setTicketCost(BigDecimal.valueOf(4500.0));
		activeFlight.setDepartureTime(LocalDateTime.now().plusDays(2));
		activeFlight.setStatus("ACTIVE");
	}

	@Test
	@DisplayName("createBooking: should create booking successfully when flight is active and seats available")
	void test_createBooking_happyPath_returnsBookingId() {
		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doNothing().when(flightServiceClient).reduceSeats(anyLong(), anyInt(), eq(SeatClass.ECONOMY));

		Booking savedBooking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001")
				.flightId(1L).numberOfSeats(1).totalPrice(BigDecimal.valueOf(4500.0)).status(BookingStatus.CONFIRMED)
				.build();

		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		Long bookingId = bookingService.createBooking(1L, validRequest);

		assertNotNull(bookingId);
		assertEquals(1L, bookingId);
		verify(flightServiceClient, times(1)).getFlightById(1L);
		verify(flightServiceClient, times(1)).reduceSeats(1L, 1, SeatClass.ECONOMY);
		verify(bookingRepository, times(1)).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: numberOfSeats should be derived from passengers list size")
	void test_createBooking_multiplePassengers_seatsCalculatedFromList() {
		PassengerRequest p2 = new PassengerRequest();
		p2.setFirstName("Priya");
		p2.setLastName("Sharma");
		p2.setMealPreference("NONE");

		validRequest.setPassengers(List.of(validRequest.getPassengers().get(0), p2));

		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doNothing().when(flightServiceClient).reduceSeats(anyLong(), anyInt(), eq(SeatClass.ECONOMY));

		Booking savedBooking = Booking.builder().bookingId(99L).bookingReference("FLY1234567").numberOfSeats(2)
				.totalPrice(BigDecimal.valueOf(9000.0)).status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		Long bookingId = bookingService.createBooking(1L, validRequest);

		assertEquals(99L, bookingId);
		verify(flightServiceClient, times(1)).reduceSeats(1L, 2, SeatClass.ECONOMY);
	}

	@Test
	@DisplayName("createBooking: should throw FlightNotActiveException when flight is not ACTIVE")
	void test_createBooking_flightNotActive_throwsException() {
		activeFlight.setStatus("CANCELLED");
		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);

		FlightNotActiveException exception = assertThrows(FlightNotActiveException.class,
				() -> bookingService.createBooking(1L, validRequest));

		assertEquals("Flight 1 is not active", exception.getMessage());
		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: should throw InsufficientSeatsException when no seats available")
	void test_createBooking_noSeatsAvailable_throwsException() {
		activeFlight.setEconomySeats(0);
		activeFlight.setBusinessSeats(0);
		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);

		InsufficientSeatsException exception = assertThrows(InsufficientSeatsException.class,
				() -> bookingService.createBooking(1L, validRequest));

		assertTrue(exception.getMessage().contains("ECONOMY"));
		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: should throw InsufficientSeatsException when passengers exceed available seats")
	void test_createBooking_passengersExceedAvailableSeats_throwsException() {
		activeFlight.setEconomySeats(1);
		activeFlight.setBusinessSeats(0);

		PassengerRequest p2 = new PassengerRequest();
		p2.setFirstName("Priya");
		p2.setLastName("Sharma");
		p2.setMealPreference("NONE");

		PassengerRequest p3 = new PassengerRequest();
		p3.setFirstName("Arjun");
		p3.setLastName("Kumar");
		p3.setMealPreference("NONE");

		validRequest.setPassengers(List.of(validRequest.getPassengers().get(0), p2, p3));

		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);

		InsufficientSeatsException exception = assertThrows(InsufficientSeatsException.class,
				() -> bookingService.createBooking(1L, validRequest));

		assertTrue(exception.getMessage().contains("1 seats available"));
		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: should throw FlightServiceUnavailableException when service is down")
	void test_createBooking_flightServiceDown_throwsException() {
		when(flightServiceClient.getFlightById(1L))
				.thenThrow(new FlightServiceUnavailableException("Flight Service is currently unavailable"));

		FlightServiceUnavailableException exception = assertThrows(FlightServiceUnavailableException.class,
				() -> bookingService.createBooking(1L, validRequest));

		assertEquals("Flight Service is currently unavailable", exception.getMessage());
		verify(bookingRepository, never()).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: booking should stay PENDING when reduceSeats fails")
	void test_createBooking_reduceSeatsFailure_bookingStaysPending() {
		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doThrow(new RuntimeException("Service Unavailable")).when(flightServiceClient).reduceSeats(anyLong(), anyInt(),
				any());
		Booking savedBooking = Booking.builder().bookingId(1L).bookingReference("FLY1234567")
				.status(BookingStatus.PENDING).build();

		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		Long bookingId = bookingService.createBooking(1L, validRequest);

		assertEquals(1L, bookingId);
		verify(bookingRepository, times(1)).save(any(Booking.class));
	}

	@Test
	@DisplayName("createBooking: should default meal preference to NONE when null")
	void test_createBooking_nullMealPreference_defaultsToNone() {
		validRequest.getPassengers().get(0).setMealPreference(null);

		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doNothing().when(flightServiceClient).reduceSeats(anyLong(), anyInt(), eq(SeatClass.ECONOMY));
		Booking savedBooking = Booking.builder().bookingId(1L).bookingReference("FLY1234567")
				.status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		assertDoesNotThrow(() -> bookingService.createBooking(1L, validRequest));
	}

	@Test
	@DisplayName("createBooking: should throw InsufficientSeatsException when passengers exceed specific class capacity")
	void test_createBooking_passengersExceedClassCapacity_throwsException() {
		activeFlight.setEconomySeats(30);
		activeFlight.setBusinessSeats(10);

		List<PassengerRequest> passengers = new java.util.ArrayList<>();
		for (int i = 0; i < 35; i++) {
			PassengerRequest p = new PassengerRequest();
			p.setFirstName("Passenger" + i);
			p.setLastName("Test");
			p.setMealPreference("NONE");
			passengers.add(p);
		}
		validRequest.setPassengers(passengers);
		validRequest.setSeatClass("ECONOMY");

		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		assertThrows(InsufficientSeatsException.class, () -> bookingService.createBooking(1L, validRequest));
	}

	@Test
	@DisplayName("createBooking: should succeed when passenger count exactly equals available seats")
	void test_createBooking_exactSeatBoundary_succeeds() {
		List<PassengerRequest> passengers = new java.util.ArrayList<>();
		for (int i = 0; i < 42; i++) {
			PassengerRequest p = new PassengerRequest();
			p.setFirstName("Passenger" + i);
			p.setLastName("Test");
			p.setMealPreference("NONE");
			passengers.add(p);
		}
		validRequest.setPassengers(passengers);

		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doNothing().when(flightServiceClient).reduceSeats(anyLong(), anyInt(), eq(SeatClass.ECONOMY));

		Booking savedBooking = Booking.builder().bookingId(1L).bookingReference("FLY1234567")
				.status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		assertDoesNotThrow(() -> bookingService.createBooking(1L, validRequest));
	}

	@Test
	@DisplayName("createBooking: should handle invalid meal preference gracefully")
	void test_createBooking_invalidMealPreference_defaultsToNone() {
		validRequest.getPassengers().get(0).setMealPreference("INVALID_VALUE");

		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doNothing().when(flightServiceClient).reduceSeats(anyLong(), anyInt(), eq(SeatClass.ECONOMY));

		Booking savedBooking = Booking.builder().bookingId(1L).bookingReference("FLY1234567")
				.status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		assertDoesNotThrow(() -> bookingService.createBooking(1L, validRequest));
	}

	@Test
	@DisplayName("getBookingById: should return booking when found")
	void test_getBookingById_found_returnsBooking() {
		Booking booking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001").flightId(1L)
				.numberOfSeats(1).totalPrice(BigDecimal.valueOf(4500.0)).status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.findByIdWithPassengers(1L)).thenReturn(Optional.of(booking));

		BookingResponse response = bookingService.getBookingById(1L);

		assertNotNull(response);
		assertEquals(1L, response.getBookingId());
		assertEquals("FLY1234567", response.getBookingReference());
		assertEquals(BookingStatus.CONFIRMED, response.getStatus());
		verify(bookingRepository, times(1)).findByIdWithPassengers(1L);
	}

	@Test
	@DisplayName("getBookingById: should throw BookingNotFoundException when not found")
	void test_getBookingById_notFound_throwsException() {
		when(bookingRepository.findByIdWithPassengers(99L)).thenReturn(Optional.empty());

		BookingNotFoundException ex = assertThrows(BookingNotFoundException.class,
				() -> bookingService.getBookingById(99L));

		assertEquals("Booking not found with id: 99", ex.getMessage());
	}

	@Test
	@DisplayName("getBookingByUserId: should return paginated bookings for user")
	void test_getBookingByUserId_returnsPagedResults() {
		Booking booking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001").flightId(1L)
				.numberOfSeats(1).totalPrice(BigDecimal.valueOf(4500.0)).status(BookingStatus.CONFIRMED).build();

		Page<Booking> page = new PageImpl<>(List.of(booking));
		Pageable pageable = PageRequest.of(0, 10);

		when(bookingRepository.findByUserIdOrderByBookingTimeDesc("USER-001", pageable)).thenReturn(page);

		Page<BookingResponse> result = bookingService.getBookingsByUserId("USER-001", pageable);

		assertNotNull(result);
		assertEquals(1, result.getTotalElements());
		assertEquals("USER-001", result.getContent().get(0).getUserId());
	}

	@Test
	@DisplayName("getBookingByUserId: should return empty page when user has no bookings")
	void test_getBookingByUserId_noBookings_returnsEmptyPage() {
		Pageable pageable = PageRequest.of(0, 10);
		when(bookingRepository.findByUserIdOrderByBookingTimeDesc("USER-999", pageable)).thenReturn(Page.empty());

		Page<BookingResponse> result = bookingService.getBookingsByUserId("USER-999", pageable);

		assertTrue(result.isEmpty());
	}

	@Test
	@DisplayName("cancelBookingById: should cancel confirmed booking successfully")
	void test_cancelBookingById_confirmed_cancelsSuccessfully() {
		Booking booking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001").flightId(1L)
				.departureTime(java.time.LocalDateTime.now().plusDays(2)).numberOfSeats(1)
				.totalPrice(BigDecimal.valueOf(4500.0)).seatClass(SeatClass.ECONOMY).status(BookingStatus.CONFIRMED)
				.build();

		Payment payment = Payment.builder().paymentStatus(PaymentStatus.SUCCESS).build();
		booking.setPayment(payment);

		when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
		when(bookingRepository.save(any(Booking.class))).thenReturn(booking);
		doNothing().when(flightServiceClient).restoreSeats(anyLong(), anyInt(), eq(SeatClass.ECONOMY));

		CancelBookingResponse response = bookingService.cancelBookingById(1L, "USER-001");

		assertEquals(BookingStatus.CANCELLED, response.getStatus());
		assertEquals("FLY1234567", response.getBookingReference());
		assertNotNull(response.getCancelledAt());
		verify(flightServiceClient, times(1)).restoreSeats(1L, 1, SeatClass.ECONOMY);
	}

	@Test
	@DisplayName("cancelBookingById: should throw BookingNotFoundException when booking not found")
	void test_cancelBookingById_notFound_throwsException() {
		when(bookingRepository.findById(99L)).thenReturn(Optional.empty());

		assertThrows(BookingNotFoundException.class, () -> bookingService.cancelBookingById(99L, "USER-001"));
	}

	@Test
	@DisplayName("cancelBookingById: should throw UnauthorizedBookingAccessException when user does not own booking")
	void test_cancelBookingById_wrongUser_throwsUnauthorized() {
		Booking booking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001")
				.departureTime(LocalDateTime.now().plusDays(2)).status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

		assertThrows(UnauthorizedBookingAccessException.class, () -> bookingService.cancelBookingById(1L, "USER-999"));
	}

	@Test
	@DisplayName("cancelBookingById: should throw BookingAlreadyCancelledException when already cancelled")
	void test_cancelBookingById_alreadyCancelled_throwsException() {
		Booking booking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001")
				.departureTime(LocalDateTime.now().plusDays(2)).status(BookingStatus.CANCELLED).build();

		when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

		assertThrows(BookingAlreadyCancelledException.class, () -> bookingService.cancelBookingById(1L, "USER-001"));
	}

	@Test
	@DisplayName("cancelBookingById: should still cancel when restorSeats fails")
	void test_cancelBookingById_restoreSeatsFailure_stillCancels() {
		Booking booking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001").flightId(1L)
				.departureTime(java.time.LocalDateTime.now().plusDays(2)).numberOfSeats(1).seatClass(SeatClass.ECONOMY)
				.status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
		when(bookingRepository.save(any(Booking.class))).thenReturn(booking);
		doThrow(new RuntimeException("Service Down")).when(flightServiceClient).restoreSeats(anyLong(), anyInt(),
				any());

		CancelBookingResponse response = bookingService.cancelBookingById(1L, "USER-001");

		assertEquals(BookingStatus.CANCELLED, response.getStatus());

	}

	@Test
	@DisplayName("createBooking: should throw DuplicateBookingException when booking already exists")
	void test_createBooking_duplicate_throwsException() {
		when(bookingRepository.existsByUserIdAndFlightIdAndStatusNot("USER-001", 1L, BookingStatus.CANCELLED))
				.thenReturn(true);

		assertThrows(DuplicateBookingException.class, () -> bookingService.createBooking(1L, validRequest));

		verify(flightServiceClient, never()).getFlightById(anyLong());
		verify(bookingRepository, never()).save(any());
	}

	@Test
	@DisplayName("getBookingByBookingReference: should return booking when found")
	void test_getBookingByBookingReference_found() {
		Booking booking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001")
				.status(BookingStatus.CONFIRMED).build();
		when(bookingRepository.findByBookingReference("FLY1234567")).thenReturn(Optional.of(booking));

		BookingResponse response = bookingService.getBookingByBookingReference("FLY1234567");
		assertEquals("FLY1234567", response.getBookingReference());
	}

	@Test
	@DisplayName("getAllBookings: should return all bookings paginated")
	void test_getAllBookings() {
		Booking booking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001").build();
		Page<Booking> page = new PageImpl<>(List.of(booking));
		when(bookingRepository.findAll(any(Pageable.class))).thenReturn(page);

		Page<BookingResponse> result = bookingService.getAllBookings(PageRequest.of(0, 10));
		assertEquals(1, result.getTotalElements());
	}

	@Test
	@DisplayName("cancelBooking: should cancel using PNR reference")
	void test_cancelBooking_byPnr_success() {
		Booking booking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001")
				.departureTime(LocalDateTime.now().plusDays(2)).numberOfSeats(1).seatClass(SeatClass.ECONOMY)
				.status(BookingStatus.CONFIRMED).build();
		Payment payment = Payment.builder().paymentStatus(PaymentStatus.SUCCESS).build();
		booking.setPayment(payment);

		when(bookingRepository.findByBookingReference("FLY1234567")).thenReturn(Optional.of(booking));
		when(bookingRepository.save(any(Booking.class))).thenReturn(booking);
		doNothing().when(flightServiceClient).restoreSeats(anyLong(), anyInt(), eq(SeatClass.ECONOMY));

		CancelBookingResponse response = bookingService.cancelBooking("FLY1234567", "USER-001");
		assertEquals(BookingStatus.CANCELLED, response.getStatus());
	}

	@Test
	@DisplayName("cancelBookingById: should throw CancellationNotAllowedException if within 24h of departure")
	void test_cancelBookingById_within24Hours_throwsException() {
		Booking booking = Booking.builder().bookingId(1L).bookingReference("FLY1234567").userId("USER-001")
				.departureTime(LocalDateTime.now().plusHours(12)).status(BookingStatus.CONFIRMED).build();

		when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

		assertThrows(com.flightapp.booking.exception.CancellationNotAllowedException.class,
				() -> bookingService.cancelBookingById(1L, "USER-001"));
	}

	@Test
	@DisplayName("createBooking: business class pricing multiplier check")
	void test_createBooking_businessMultiplier() {
		validRequest.setSeatClass("BUSINESS");
		when(flightServiceClient.getFlightById(1L)).thenReturn(activeFlight);
		doNothing().when(flightServiceClient).reduceSeats(1L, 1, SeatClass.BUSINESS);

		BigDecimal expectedPrice = BigDecimal.valueOf(6750.0);
		Booking savedBooking = Booking.builder().bookingId(1L).totalPrice(expectedPrice).status(BookingStatus.CONFIRMED)
				.build();
		when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

		bookingService.createBooking(1L, validRequest);

		verify(bookingRepository).save(org.mockito.ArgumentMatchers.argThat(
				b -> b.getTotalPrice().compareTo(expectedPrice) == 0 && b.getSeatClass() == SeatClass.BUSINESS));
	}
}