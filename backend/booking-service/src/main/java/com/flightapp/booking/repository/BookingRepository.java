package com.flightapp.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flightapp.booking.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}