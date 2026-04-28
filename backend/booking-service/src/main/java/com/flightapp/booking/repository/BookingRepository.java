package com.flightapp.booking.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.flightapp.booking.model.Booking;
import com.flightapp.booking.model.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	Optional<Booking> findByBookingReference(String bookingReference);

	Page<Booking> findByUserIdOrderByBookingTimeDesc(String userId, Pageable pageable);

	@Query("SELECT booking From Booking booking LEFT JOIN FETCH booking.passengers WHERE booking.bookingId = :id")
	Optional<Booking> findByIdWithPassengers(@Param("id") Long id);

	boolean existsByBookingIdAndUserId(Long bookingId, String userId);

	boolean existsByUserIdAndFlightIdAndStatusNot(String userId, Long flightId, BookingStatus status);
}