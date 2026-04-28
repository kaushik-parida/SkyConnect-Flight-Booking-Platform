package com.flightapp.booking.service.implementation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flightapp.booking.client.FlightServiceClient;
import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.dto.CancelBookingResponse;
import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.dto.PassengerResponse;
import com.flightapp.booking.dto.external.FlightResponse;
import com.flightapp.booking.exception.BookingAlreadyCancelledException;
import com.flightapp.booking.exception.BookingNotFoundException;
import com.flightapp.booking.exception.DuplicateBookingException;
import com.flightapp.booking.exception.FlightNotActiveException;
import com.flightapp.booking.exception.InsufficientSeatsException;
import com.flightapp.booking.exception.UnauthorizedBookingAccessException;
import com.flightapp.booking.model.Booking;
import com.flightapp.booking.model.BookingPassenger;
import com.flightapp.booking.model.BookingStatus;
import com.flightapp.booking.model.MealPreference;
import com.flightapp.booking.model.Payment;
import com.flightapp.booking.model.PaymentMethod;
import com.flightapp.booking.model.PaymentStatus;
import com.flightapp.booking.repository.BookingRepository;
import com.flightapp.booking.service.BookingService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BookingServiceImplementation implements BookingService {

	private final BookingRepository bookingRepository;
	private final FlightServiceClient flightServiceClient;

	public BookingServiceImplementation(BookingRepository bookingRepository, FlightServiceClient flightServiceClient) {
		this.bookingRepository = bookingRepository;
		this.flightServiceClient = flightServiceClient;
	}

	@Override
	@Transactional
	public Long createBooking(CreateBookingRequest request) {
		log.info("Creating booking — userId: {} flightId: {}", request.getUserId(), request.getFlightId());

		boolean duplicateExists = bookingRepository.existsByUserIdAndFlightIdAndStatusNot(request.getUserId(),
				request.getFlightId(), BookingStatus.CANCELLED);

		if (duplicateExists) {
			log.warn("Duplicate booking attempt — userId: {} flightId: {}", request.getUserId(), request.getFlightId());
			throw new DuplicateBookingException("An active booking already exists for this flight and user");
		}

		FlightResponse flight = flightServiceClient.getFlightById(request.getFlightId());

		if (!"ACTIVE".equals(flight.getStatus())) {
			throw new FlightNotActiveException("Flight " + request.getFlightId() + " is not active");
		}

		int numberOfSeats = request.getPassengers().size();

		int availableSeats = flight.getEconomySeats() + flight.getBusinessSeats();
		if (availableSeats < numberOfSeats) {
			throw new InsufficientSeatsException("Only " + availableSeats + " seats available");
		}

		BigDecimal totalPrice = flight.getTicketCost().multiply(BigDecimal.valueOf(numberOfSeats));

		Booking booking = Booking.builder().bookingReference(generateBookingReference()).userId(request.getUserId())
				.flightId(request.getFlightId()).numberOfSeats(numberOfSeats).totalPrice(totalPrice)
				.status(BookingStatus.PENDING).build();

		request.getPassengers().forEach(p -> {
			BookingPassenger passenger = BookingPassenger.builder().firstName(p.getFirstName())
					.lastName(p.getLastName()).passportNumber(p.getPassportNumber()).dateOfBirth(p.getDateOfBirth())
					.mealPreference(parseMealPreference(p.getMealPreference())).build();
			booking.addPassenger(passenger);
		});

		Payment payment = Payment.builder().booking(booking).amount(totalPrice)
				.paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod())).paymentStatus(PaymentStatus.PENDING)
				.build();
		booking.setPayment(payment);

		Booking saved = bookingRepository.save(booking);
		log.info("Booking persisted — ref: {} status: PENDING", saved.getBookingReference());

		try {
			flightServiceClient.reduceSeats(request.getFlightId(), numberOfSeats);
			saved.setStatus(BookingStatus.CONFIRMED);
			saved.getPayment().setPaymentStatus(PaymentStatus.SUCCESS);
			saved.getPayment().setPaidAt(LocalDateTime.now());
			bookingRepository.save(saved);
			log.info("Booking confirmed — ref: {}", saved.getBookingReference());
		} catch (Exception e) {
			log.warn("Seat reduction failed — booking stays PENDING ref: {} reason: {}", saved.getBookingReference(),
					e.getMessage());
		}

		return saved.getBookingId();
	}

	@Override
	@Transactional(readOnly = true)
	public BookingResponse getBookingById(Long bookingId) {
		log.debug("Fetching booking — id: {}", bookingId);
		Booking booking = bookingRepository.findByIdWithPassengers(bookingId)
				.orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
		return mapToResponse(booking);
	}

	@Override
	@Transactional(readOnly = true)
	public Page<BookingResponse> getBookingsByUserId(String userId, Pageable pageable) {
		log.debug("Fetching bookings — userId: {} page: {}", userId, pageable.getPageNumber());
		return bookingRepository.findByUserIdOrderByBookingTimeDesc(userId, pageable).map(this::mapToResponse);
	}

	@Override
	@Transactional(readOnly = true)
	public Page<BookingResponse> getAllBookings(Pageable pageable) {
		log.debug("Fetching all bookings — page: {}", pageable.getPageNumber());
		return bookingRepository.findAll(pageable).map(this::mapToResponse);
	}

	@Override
	@Transactional
	public CancelBookingResponse cancelBooking(Long bookingId, String userId) {
		log.info("Cancel request — bookingId: {} userId: {}", bookingId, userId);

		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

		if (!booking.getUserId().equals(userId)) {
			throw new UnauthorizedBookingAccessException("You are not authorized to cancel this booking");
		}

		if (BookingStatus.CANCELLED.equals(booking.getStatus())) {
			throw new BookingAlreadyCancelledException(
					"Booking " + booking.getBookingReference() + " is already cancelled");
		}

		booking.setStatus(BookingStatus.CANCELLED);
		if (booking.getPayment() != null) {
			booking.getPayment().setPaymentStatus(PaymentStatus.REFUNDED);
		}
		bookingRepository.save(booking);
		log.info("Booking cancelled — ref: {}", booking.getBookingReference());

		try {
			flightServiceClient.restoreSeats(booking.getFlightId(), booking.getNumberOfSeats());
		} catch (Exception e) {
			log.warn("Seat restoration failed — ref: {} reason: {}", booking.getBookingReference(), e.getMessage());
		}

		return CancelBookingResponse.builder().bookingId(booking.getBookingId())
				.bookingReference(booking.getBookingReference()).status(BookingStatus.CANCELLED)
				.message("Booking cancelled successfully. Refund will be processed in 5-7 business days.")
				.cancelledAt(LocalDateTime.now()).build();
	}

	private String generateBookingReference() {
		return "FLY" + UUID.randomUUID().toString().replace("-", "").substring(0, 7).toUpperCase(); //TODO: change randomUUID with timestamp and userpart
	}

	private MealPreference parseMealPreference(String value) {
		if (value == null)
			return MealPreference.NONE;
		try {
			return MealPreference.valueOf(value.toUpperCase());
		} catch (IllegalArgumentException e) {
			return MealPreference.NONE;
		}
	}

	private BookingResponse mapToResponse(Booking booking) {
		List<PassengerResponse> passengers = booking.getPassengers().stream()
				.map(p -> PassengerResponse.builder().passengerId(p.getPassengerId()).firstName(p.getFirstName())
						.lastName(p.getLastName()).passportNumber(p.getPassportNumber()).dateOfBirth(p.getDateOfBirth())
						.mealPreference(p.getMealPreference().name()).build())
				.collect(Collectors.toList());

		return BookingResponse.builder().bookingId(booking.getBookingId()).bookingReference(booking.getBookingReference())
				.flightId(booking.getFlightId()).userId(booking.getUserId()).numberOfSeats(booking.getNumberOfSeats())
				.totalPrice(booking.getTotalPrice()).status(booking.getStatus()).bookingTime(booking.getBookingTime())
				.passengers(passengers).build();
	}
}