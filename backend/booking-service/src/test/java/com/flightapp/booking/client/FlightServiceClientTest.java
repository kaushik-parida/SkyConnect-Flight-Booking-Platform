package com.flightapp.booking.client;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.flightapp.booking.dto.external.FlightResponse;
import com.flightapp.booking.exception.FlightNotFoundException;
import com.flightapp.booking.exception.FlightServiceUnavailableException;
import com.flightapp.booking.model.SeatClass;

import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
public class FlightServiceClientTest {

	@Mock
	private WebClient webClient;

	@Mock
	private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

	@Mock
	private WebClient.RequestHeadersSpec requestHeadersSpec;

	@Mock
	private WebClient.ResponseSpec responseSpec;

	@Mock
	private WebClient.RequestBodyUriSpec requestBodyUriSpec;

	@Mock
	private WebClient.RequestBodySpec requestBodySpec;

	private FlightServiceClient flightServiceClient;

	@BeforeEach
	void setUp() {
		flightServiceClient = new FlightServiceClient(webClient);
	}

	private FlightResponse buildFlightResponse() {
		FlightResponse flight = new FlightResponse();
		flight.setFlightId(1L);
		flight.setEconomySeats(42);
		flight.setBusinessSeats(10);
		flight.setTicketCost(BigDecimal.valueOf(4500.0));
		flight.setStatus("ACTIVE");
		return flight;
	}

	@Test
	@DisplayName("getFlightById: should return FlightResponse when flight exists")
	void test_getFlightById_flightExists_returnsFlightResponse() {
		FlightResponse expected = buildFlightResponse();

		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class)).thenReturn(Mono.just(expected));

		FlightResponse result = flightServiceClient.getFlightById(1L);

		assertNotNull(result);
		assertEquals(1L, result.getFlightId());
		assertEquals("ACTIVE", result.getStatus());
		assertEquals(42, result.getEconomySeats());
		assertEquals(10, result.getBusinessSeats());
		assertEquals(BigDecimal.valueOf(4500.0), result.getTicketCost());
	}

	@Test
	@DisplayName("getFlightById: should throw FlightNotFoundException when flight not found")
	void test_getFlightById_flightNotFound_throwsFlightNotFoundException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class))
				.thenReturn(Mono.error(WebClientResponseException.NotFound.create(404, "Not Found", null, null, null)));

		FlightNotFoundException exception = assertThrows(FlightNotFoundException.class,
				() -> flightServiceClient.getFlightById(999L));

		assertTrue(exception.getMessage().contains("999"));
	}

	@Test
	@DisplayName("getFlightById: should throw FlightServiceUnavailableException when service is down")
	void test_getFlightById_serviceDown_throwsUnavailableException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class))
				.thenReturn(Mono.error(new RuntimeException("Connection refused")));

		assertThrows(FlightServiceUnavailableException.class, () -> flightServiceClient.getFlightById(1L));
	}

	@Test
	@DisplayName("reduceSeats: should reduce seats successfully")
	void test_reduceSeats_success() {
		FlightResponse current = buildFlightResponse();

		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class)).thenReturn(Mono.just(current));

		when(webClient.patch()).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(anyString(), anyLong())).thenReturn(requestBodySpec);
		when(requestBodySpec.bodyValue(any())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(Void.class)).thenReturn(Mono.empty());

		assertDoesNotThrow(() -> flightServiceClient.reduceSeats(1L, 2, SeatClass.ECONOMY));
	}

	@Test
	@DisplayName("reduceSeats: should throw FlightNotFoundException when flight not found")
	void test_reduceSeats_flightNotFound_throwsException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class))
				.thenReturn(Mono.error(WebClientResponseException.NotFound.create(404, "Not Found", null, null, null)));

		assertThrows(FlightNotFoundException.class, () -> flightServiceClient.reduceSeats(999L, 1, SeatClass.ECONOMY));
	}

	@Test
	@DisplayName("reduceSeats: should throw FlightServiceUnavailableException when service is down")
	void test_reduceSeats_serviceDown_throwsUnavailableException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class))
				.thenReturn(Mono.error(new RuntimeException("Connection refused")));

		assertThrows(FlightServiceUnavailableException.class,
				() -> flightServiceClient.reduceSeats(1L, 2, SeatClass.ECONOMY));
	}

	@Test
	@DisplayName("restoreSeats: should restore seats successfully")
	void test_restoreSeats_success() {
		FlightResponse current = buildFlightResponse();

		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class)).thenReturn(Mono.just(current));

		when(webClient.patch()).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(anyString(), anyLong())).thenReturn(requestBodySpec);
		when(requestBodySpec.bodyValue(any())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(Void.class)).thenReturn(Mono.empty());

		assertDoesNotThrow(() -> flightServiceClient.restoreSeats(1L, 2, SeatClass.ECONOMY));
	}

	@Test
	@DisplayName("restoreSeats: should throw FlightNotFoundException when response is null")
	void test_restoreSeats_nullResponse_throwsFlightNotFoundException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class)).thenReturn(Mono.empty());

		FlightNotFoundException ex = assertThrows(FlightNotFoundException.class,
				() -> flightServiceClient.restoreSeats(1L, 2, SeatClass.ECONOMY));

		assertTrue(ex.getMessage().contains("1"));
	}

	@Test
	@DisplayName("restoreSeats: should throw FlightNotFoundException on 404")
	void test_restoreSeats_404_throwsFlightNotFoundException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class))
				.thenReturn(Mono.error(WebClientResponseException.NotFound.create(404, "Not Found", null, null, null)));

		assertThrows(FlightNotFoundException.class, () -> flightServiceClient.restoreSeats(999L, 2, SeatClass.ECONOMY));
	}

	@Test
	@DisplayName("restoreSeats: should throw FlightServiceUnavailableException when service is down")
	void test_restoreSeats_serviceDown_throwsUnavailableException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class))
				.thenReturn(Mono.error(new RuntimeException("Connection refused")));

		assertThrows(FlightServiceUnavailableException.class,
				() -> flightServiceClient.restoreSeats(1L, 2, SeatClass.ECONOMY));
	}

	@Test
	@DisplayName("reduceSeats: should throw FlightNotFoundException when response is null")
	void test_reduceSeats_nullResponse_throwsFlightNotFoundException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class)).thenReturn(Mono.empty());

		FlightNotFoundException ex = assertThrows(FlightNotFoundException.class,
				() -> flightServiceClient.reduceSeats(1L, 2, SeatClass.ECONOMY));

		assertTrue(ex.getMessage().contains("1"));
	}

	@Test
	@DisplayName("reduceSeats: should rethrow FlightNotFoundException directly without wrapping")
	void test_reduceSeats_flightNotFoundRethrown() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class))
				.thenReturn(Mono.error(WebClientResponseException.NotFound.create(404, "Not Found", null, null, null)));

		FlightNotFoundException ex = assertThrows(FlightNotFoundException.class,
				() -> flightServiceClient.reduceSeats(999L, 2, SeatClass.ECONOMY));

		assertTrue(ex.getMessage().contains("Flight not found"));
		assertFalse(ex.getMessage().contains("unavailable"));
	}

	@Test
	@DisplayName("reduceSeats: should specifically reduce business seats when class is BUSINESS")
	void test_reduceSeats_business_success() {
		FlightResponse current = buildFlightResponse();

		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class)).thenReturn(Mono.just(current));

		when(webClient.patch()).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(anyString(), anyLong())).thenReturn(requestBodySpec);

		when(requestBodySpec.bodyValue(org.mockito.ArgumentMatchers.argThat(map -> {
			Map<String, Object> body = (Map<String, Object>) map;
			return body.get("businessSeats").equals(9) && body.get("economySeats").equals(42);
		}))).thenReturn(requestHeadersSpec);

		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(Void.class)).thenReturn(Mono.empty());

		assertDoesNotThrow(() -> flightServiceClient.reduceSeats(1L, 1, SeatClass.BUSINESS));
	}

	@Test
	@DisplayName("restoreSeats: should specifically restore business seats when class is BUSINESS")
	void test_restoreSeats_business_success() {
		FlightResponse current = buildFlightResponse();

		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class)).thenReturn(Mono.just(current));

		when(webClient.patch()).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(anyString(), anyLong())).thenReturn(requestBodySpec);

		when(requestBodySpec.bodyValue(org.mockito.ArgumentMatchers.argThat(map -> {
			Map<String, Object> body = (Map<String, Object>) map;
			return body.get("businessSeats").equals(12);
		}))).thenReturn(requestHeadersSpec);

		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(Void.class)).thenReturn(Mono.empty());

		assertDoesNotThrow(() -> flightServiceClient.restoreSeats(1L, 2, SeatClass.BUSINESS));
	}
}