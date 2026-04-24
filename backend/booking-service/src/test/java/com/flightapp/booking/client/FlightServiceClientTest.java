package com.flightapp.booking.client;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

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
class FlightServiceClientTest {

	@Mock
	private WebClient webClient;

	@Mock
	private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

	@Mock
	private WebClient.RequestHeadersSpec requestHeadersSpec;

	@Mock
	private WebClient.ResponseSpec responseSpec;

	private FlightServiceClient flightServiceClient;

	@BeforeEach
	void setUp() {
		flightServiceClient = new FlightServiceClient(webClient);
	}

	@Test
	@DisplayName("getFlightById: should return FlightResponse when flight exists")
	void test_getFlightById_flightExists_returnsFlightResponse() {
		FlightResponse expected = new FlightResponse();
		expected.setFlightId(1L);
		expected.setStatus("ACTIVE");
		expected.setAvailableSeats(42);
		expected.setTicketCost(4500.0);

		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class)).thenReturn(Mono.just(expected));

		FlightResponse result = flightServiceClient.getFlightById(1L);

		assertNotNull(result);
		assertEquals(1L, result.getFlightId());
		assertEquals("ACTIVE", result.getStatus());
		assertEquals(42, result.getAvailableSeats());
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
	void test_getFlightById_serviceDown_throwsFlightServiceUnavailableException() {
		when(webClient.get()).thenReturn(requestHeadersUriSpec);
		when(requestHeadersUriSpec.uri(anyString(), anyLong())).thenReturn(requestHeadersSpec);
		when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
		when(responseSpec.bodyToMono(FlightResponse.class))
				.thenReturn(Mono.error(new RuntimeException("Connection refused")));

		assertThrows(FlightServiceUnavailableException.class, () -> flightServiceClient.getFlightById(1L));
	}
}