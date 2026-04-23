package com.flightapp.booking.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bookings", indexes = { @Index(name = "idx_user_id", columnList = "user_id"),
		@Index(name = "idx_flight_id", columnList = "flight_id"), @Index(name = "idx_status", columnList = "status"),
		@Index(name = "idx_booking_ref", columnList = "booking_ref") })

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "booking_id")
	private Long bookingId;

	@Column(name = "booking_ref", nullable = false, unique = true, length = 10)
	private String bookingRef;

	@Column(name = "user_id", nullable = false, length = 36)
	private String userId;

	@Column(name = "flight_id", nullable = false)
	private Long flightId;

	@Column(name = "number_of_seats", nullable = false)
	private Integer numberOfSeats;

	@Column(name = "total_price", nullable = false, precision = 10, scale = 2)
	private BigDecimal totalPrice;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	@Builder.Default
	private BookingStatus status = BookingStatus.PENDING;

	@CreationTimestamp
	@Column(name = "booking_time", nullable = false, updatable = false)
	private LocalDateTime bookingTime;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	@Builder.Default
	private List<BookingPassenger> passengers = new ArrayList<>();

	@OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private Payment payment;

	public void addPassenger(BookingPassenger passenger) {
		passengers.add(passenger);
		passenger.setBooking(this);
	}
}