package com.flightapp.booking.service.implementation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flightapp.booking.client.FlightServiceClient;
import com.flightapp.booking.dto.CreateBookingRequest;
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

		Booking booking = Booking.builder().bookingRef(generateBookingRef()).userId(request.getUserId())
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
		log.info("Booking persisted — ref: {} status: PENDING", saved.getBookingRef());

		try {
			flightServiceClient.reduceSeats(request.getFlightId(), numberOfSeats);
			saved.setStatus(BookingStatus.CONFIRMED);
			saved.getPayment().setPaymentStatus(PaymentStatus.SUCCESS);
			saved.getPayment().setPaidAt(LocalDateTime.now());
			bookingRepository.save(saved);
			log.info("Booking confirmed — ref: {}", saved.getBookingRef());
		} catch (Exception e) {
			log.warn("Seat reduction failed — stays PENDING ref: {} reason: {}", saved.getBookingRef(), e.getMessage());
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
}