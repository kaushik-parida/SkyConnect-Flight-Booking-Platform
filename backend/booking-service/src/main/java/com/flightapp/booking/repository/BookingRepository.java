package com.flightapp.booking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.flightapp.booking.model.Booking;
import com.flightapp.booking.model.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	Optional<Booking> findByBookingRef(String bookingRef);

	List<Booking> findByUserIdOrderByBookingTimeDesc(String userId);

	List<Booking> findByFlightId(Long flightId);

	@Query("SELECT b FROM Booking b LEFT JOIN FETCH b.passengers WHERE b.userId = :userId")
	List<Booking> findByUserIdWithPassengers(@Param("userId") String userId);

	boolean existsByFlightIdAndStatus(Long flightId, BookingStatus status);
}