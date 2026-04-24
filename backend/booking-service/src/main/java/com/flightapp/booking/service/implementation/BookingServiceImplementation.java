package com.flightapp.booking.service.implementation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flightapp.booking.client.FlightServiceClient;
import com.flightapp.booking.dto.BookingResponse;
import com.flightapp.booking.dto.CreateBookingRequest;
import com.flightapp.booking.dto.PassengerResponse;
import com.flightapp.booking.dto.external.FlightResponse;
import com.flightapp.booking.exception.FlightNotActiveException;
import com.flightapp.booking.exception.InsufficientSeatsException;
import com.flightapp.booking.model.Booking;
import com.flightapp.booking.model.BookingPassenger;
import com.flightapp.booking.model.BookingStatus;
import com.flightapp.booking.model.MealPreference;
import com.flightapp.booking.model.Payment;
import com.flightapp.booking.model.PaymentMethod;
import com.flightapp.booking.model.PaymentStatus;
import com.flightapp.booking.repository.BookingRepository;
import com.flightapp.booking.service.BookingService;

@Service
public class BookingServiceImplementation implements BookingService {

	private static final Logger log = LoggerFactory.getLogger(BookingServiceImplementation.class);

	private final BookingRepository bookingRepository;
	private final FlightServiceClient flightServiceClient;

	public BookingServiceImplementation(BookingRepository bookingRepository, FlightServiceClient flightServiceClient) {
		this.bookingRepository = bookingRepository;
		this.flightServiceClient = flightServiceClient;
	}

	@Override
	@Transactional
	public Long createBooking(CreateBookingRequest request) {
		log.info("Creating booking for userId: {} flightId: {}", request.getUserId(), request.getFlightId());

		FlightResponse flight = flightServiceClient.getFlightById(request.getFlightId());

		if (!"ACTIVE".equals(flight.getStatus())) {
			throw new FlightNotActiveException("Flight " + request.getFlightId() + " is not active");
		}

		if (flight.getAvailableSeats() < request.getNumberOfSeats()) {
			throw new InsufficientSeatsException("Only " + flight.getAvailableSeats() + " seats available");
		}

		BigDecimal totalPrice = BigDecimal.valueOf(flight.getTicketCost())
				.multiply(BigDecimal.valueOf(request.getNumberOfSeats()));

		Booking booking = Booking.builder().bookingRef(generateBookingRef()).userId(request.getUserId())
				.flightId(request.getFlightId()).numberOfSeats(request.getNumberOfSeats()).totalPrice(totalPrice)
				.status(BookingStatus.PENDING).build();

		request.getPassengers().forEach(p -> {
			BookingPassenger passenger = BookingPassenger.builder().firstName(p.getFirstName())
					.lastName(p.getLastName()).passportNumber(p.getPassportNumber()).dateOfBirth(p.getDateOfBirth())
					.seatNumber(p.getSeatNumber()).mealPreference(parseMealPreference(p.getMealPreference())).build();
			booking.addPassenger(passenger);
		});

		Payment payment = Payment.builder().booking(booking).amount(totalPrice)
				.paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod())).paymentStatus(PaymentStatus.PENDING)
				.build();
		booking.setPayment(payment);

		Booking saved = bookingRepository.save(booking);
		log.info("Booking persisted with PENDING status: {}", saved.getBookingRef());

		try {
			flightServiceClient.reduceSeats(request.getFlightId(), request.getNumberOfSeats());

			saved.setStatus(BookingStatus.CONFIRMED);
			saved.getPayment().setPaymentStatus(PaymentStatus.SUCCESS);
			saved.getPayment().setPaidAt(LocalDateTime.now());
			bookingRepository.save(saved);
			log.info("Booking confirmed: {}", saved.getBookingRef());

		} catch (Exception e) {
			log.warn("Seat reduction failed — booking stays PENDING: {}", e.getMessage());
		}

		return saved.getBookingId();
	}

	private String generateBookingRef() {
		return "FLY" + UUID.randomUUID().toString().replace("-", "").substring(0, 7).toUpperCase();
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
						.seatNumber(p.getSeatNumber()).mealPreference(p.getMealPreference().name()).build())
				.collect(Collectors.toList());

		return BookingResponse.builder().bookingId(booking.getBookingId()).bookingRef(booking.getBookingRef())
				.flightId(booking.getFlightId()).userId(booking.getUserId()).numberOfSeats(booking.getNumberOfSeats())
				.totalPrice(booking.getTotalPrice()).status(booking.getStatus()).bookingTime(booking.getBookingTime())
				.passengers(passengers).build();
	}
}