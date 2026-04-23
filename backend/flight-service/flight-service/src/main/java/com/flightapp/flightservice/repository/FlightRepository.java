package com.flightapp.flightservice.repository;
import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {
    List<Flight> findByFromPlaceIgnoreCaseAndToPlaceIgnoreCaseAndDepartureTimeBetweenAndStatus(
            String fromPlace,
            String toPlace,
            LocalDateTime start,
            LocalDateTime end,
            FlightStatus status
    );
}