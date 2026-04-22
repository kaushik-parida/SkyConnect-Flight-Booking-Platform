package com.flightapp.airlineservice.repository;
import com.flightapp.airlineservice.entity.Airline;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AirlineRepository extends JpaRepository<Airline,Long> {
	List<Airline> findByActiveTrue();
}
