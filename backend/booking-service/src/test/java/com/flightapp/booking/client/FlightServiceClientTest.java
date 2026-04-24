package com.flightapp.booking.client;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

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
		flight.setBusinessSeats(0);
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
		assertEquals(0, result.getBusinessSeats());
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
	@DisplayName("reduceSeats: should reduce economy seats first then business")
	void test_reduceSeats_reducesEconomyFirst() {
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

		assertDoesNotThrow(() -> flightServiceClient.reduceSeats(1L, 2));
	}

	@Test
	@DisplayName("reduceSeats: should throw FlightNotFoundException when flight not found")
	void test_reduceSeats_flightNotFound_throwsException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class))
				.thenReturn(Mono.error(WebClientResponseException.NotFound.create(404, "Not Found", null, null, null)));

		assertThrows(FlightNotFoundException.class, () -> flightServiceClient.reduceSeats(999L, 1));
	}

	@Test
	@DisplayName("reduceSeats: should throw FlightServiceUnavailableException when service is down")
	void test_reduceSeats_serviceDown_throwsUnavailableException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class))
				.thenReturn(Mono.error(new RuntimeException("Connection refused")));

		assertThrows(FlightServiceUnavailableException.class, () -> flightServiceClient.reduceSeats(1L, 2));
	}
}