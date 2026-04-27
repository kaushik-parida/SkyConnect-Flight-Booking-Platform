package com.flightapp.booking.client;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.flightapp.booking.dto.external.FlightResponse;
import com.flightapp.booking.exception.FlightNotFoundException;
import com.flightapp.booking.exception.FlightServiceUnavailableException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class FlightServiceClient {

	private final WebClient webClient;

	public FlightServiceClient(WebClient webClient) {
		this.webClient = webClient;
	}

	public FlightResponse getFlightById(Long flightId) {
		log.debug("Calling Flight Service: GET /flights/{}", flightId);
		try {
			return webClient.get().uri("/flights/{id}", flightId).retrieve().bodyToMono(FlightResponse.class).block();
		} catch (WebClientResponseException.NotFound e) {
			log.error("Flight not found with id: {}", flightId);
			throw new FlightNotFoundException("Flight not found with id: " + flightId);
		} catch (Exception e) {
			log.error("Flight Service unavailable: {}", e.getMessage());
			throw new FlightServiceUnavailableException("Flight Service is currently unavailable");
		}
	}

	public void reduceSeats(Long flightId, int seatsToReduce) {
		log.debug("Calling Flight Service: GET /flights/{} to read current seats", flightId);
		try {
			FlightResponse current = webClient.get().uri("/flights/{id}", flightId).retrieve()
					.bodyToMono(FlightResponse.class).block();

			if (current == null) {
				throw new FlightNotFoundException("Flight not found with id: " + flightId);
			}

			int totalAvailable = current.getEconomySeats() + current.getBusinessSeats();

			int updatedEconomySeats = Math.max(0, current.getEconomySeats() - seatsToReduce);

			int remainingReduction = seatsToReduce - (current.getEconomySeats() - updatedEconomySeats);

			int updatedBusinessSeats = Math.max(0, current.getBusinessSeats() - remainingReduction);

			log.debug("Reducing seats for flight: {} | total available: {} | " + "economy: {} → {} | business: {} → {}",
					flightId, totalAvailable, current.getEconomySeats(), updatedEconomySeats,
					current.getBusinessSeats(), updatedBusinessSeats);

			Map<String, Object> body = new HashMap<>();
			body.put("economySeats", updatedEconomySeats);
			body.put("businessSeats", updatedBusinessSeats);

			webClient.patch().uri("/flights/{id}", flightId).bodyValue(body).retrieve().bodyToMono(Void.class).block();

			log.debug("Seats reduced for flight: {} new available: {}", flightId);

		} catch (FlightNotFoundException e) {
			throw e;
		} catch (WebClientResponseException.NotFound e) {
			log.error("Flight not found when reducing seats, id: {}", flightId);
			throw new FlightNotFoundException("Flight not found with id: " + flightId);
		} catch (Exception e) {
			log.error("Flight Service unavailable during seat reduction: {}", e.getMessage());
			throw new FlightServiceUnavailableException("Flight Service is currently unavailable");
		}
	}
}