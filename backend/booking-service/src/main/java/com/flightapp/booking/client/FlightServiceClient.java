package com.flightapp.booking.client;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.flightapp.booking.dto.external.FlightResponse;
import com.flightapp.booking.exception.FlightNotFoundException;
import com.flightapp.booking.exception.FlightServiceUnavailableException;
import com.flightapp.booking.model.SeatClass;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class FlightServiceClient {

	private static final String FLIGHT_BY_ID_URI = "/flights/{id}";
	private final WebClient webClient;

	public FlightServiceClient(WebClient webClient) {
		this.webClient = webClient;
	}

	public FlightResponse getFlightById(Long flightId) {
		log.debug("Calling Flight Service: GET {}", FLIGHT_BY_ID_URI.replace("{id}", flightId.toString()));
		try {
			return webClient.get().uri(FLIGHT_BY_ID_URI, flightId).retrieve().bodyToMono(FlightResponse.class).block();
		} catch (WebClientResponseException.NotFound e) {
			log.error("Flight not found with id: {}", flightId);
			throw new FlightNotFoundException("Flight not found with id: " + flightId);
		} catch (Exception e) {
			log.error("Flight Service unavailable: {}", e.getMessage(), e);
			throw new FlightServiceUnavailableException("Flight Service is currently unavailable");
		}
	}

	public void reduceSeats(Long flightId, Integer seatsToReduce, SeatClass seatClass) {
		log.debug("Reducing {} seats in {} for flight {}", seatsToReduce, seatClass, flightId);
		try {
			FlightResponse current = webClient.get().uri(FLIGHT_BY_ID_URI, flightId).retrieve()
					.bodyToMono(FlightResponse.class).block();

			if (current == null) {
				throw new FlightNotFoundException("Flight not found with id: " + flightId);
			}

			Integer updatedEconomySeats = current.getEconomySeats();
			Integer updatedBusinessSeats = current.getBusinessSeats();

			if (seatClass == seatClass.ECONOMY) {
				updatedEconomySeats = Math.max(0, updatedEconomySeats - seatsToReduce);
			} else {
				updatedBusinessSeats = Math.max(0, updatedBusinessSeats - seatsToReduce);
			}

			Map<String, Object> body = new HashMap<>();
			body.put("economySeats", updatedEconomySeats);
			body.put("businessSeats", updatedBusinessSeats);

			webClient.patch().uri(FLIGHT_BY_ID_URI, flightId).bodyValue(body).retrieve().bodyToMono(Void.class).block();

			log.debug("Seats reduced for flight: {} class: {}", flightId, seatClass);

		} catch (FlightNotFoundException | WebClientResponseException.NotFound e) {
			throw new FlightNotFoundException("Flight not found with id: " + flightId);
		} catch (Exception e) {
			log.error("Flight Service unavailable during seat reduction: {}", e.getMessage());
			throw new FlightServiceUnavailableException("Flight Service is currently unavailable");
		}
	}

	public void restoreSeats(Long flightId, Integer seatsToRestore, SeatClass seatClass) {
		log.debug("Restoring {} seats in {} for flight {}", seatsToRestore, seatClass, flightId);
		try {
			FlightResponse current = webClient.get().uri(FLIGHT_BY_ID_URI, flightId).retrieve()
					.bodyToMono(FlightResponse.class).block();

			if (current == null) {
				throw new FlightNotFoundException("Flight not found with id: " + flightId);
			}

			Integer updatedEconomySeats = current.getEconomySeats();
			Integer updatedBusinessSeats = current.getBusinessSeats();

			if (seatClass == SeatClass.ECONOMY) {
				updatedEconomySeats += seatsToRestore;
			} else {
				updatedBusinessSeats += seatsToRestore;
			}

			Map<String, Object> body = new HashMap<>();
			body.put("economySeats", updatedEconomySeats);
			body.put("businessSeats", updatedBusinessSeats);

			webClient.patch().uri(FLIGHT_BY_ID_URI, flightId).bodyValue(body).retrieve().bodyToMono(Void.class).block();

			log.debug("Seats restored for flight: {} restored: {}", flightId, seatsToRestore);

		} catch (FlightNotFoundException | WebClientResponseException.NotFound e) {
			throw new FlightNotFoundException("Flight not found with id: " + flightId);
		} catch (Exception e) {
			log.error("Failed to restore seats for flight: {} reason: {}", flightId, e.getMessage());
			throw new FlightServiceUnavailableException("Flight Service is currently unavailable");
		}
	}
}