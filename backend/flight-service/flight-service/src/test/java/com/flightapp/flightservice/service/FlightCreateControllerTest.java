package com.flightapp.flightservice.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flightapp.flightservice.airline.service.InventoryService;
import com.flightapp.flightservice.controller.FlightCreateController;
import com.flightapp.flightservice.dto.FlightCreateRequest;
import com.flightapp.flightservice.enums.MealType;

@WebMvcTest(FlightCreateController.class)
class FlightCreateControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private FlightCreateService flightCreateService;
	@MockitoBean
	private InventoryService inventoryService;
	@MockitoBean
	private FlightSearchService flightSearchService;

	@Test
	void createFlight_shouldReturnCreated_whenAdmin() throws Exception {
		when(flightCreateService.createFlight(any())).thenReturn(1L);
		mockMvc.perform(post("/api/v1.0/flights").header("X-User-Role", "ADMIN").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(validRequest()))).andExpect(status().isCreated());
	}

	@Test
	void createFlight_shouldReturnForbidden_whenNotAdmin() throws Exception {
		mockMvc.perform(post("/api/v1.0/flights").header("X-User-Role", "USER").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(validRequest()))).andExpect(status().isForbidden());
	}

	@Test
	void createFlight_shouldReturnBadRequest_whenInvalidRequest() throws Exception {
		FlightCreateRequest request = validRequest();
		request.setFlightNumber("");
		mockMvc.perform(post("/api/v1.0/flights").header("X-User-Role", "ADMIN").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))).andExpect(status().isBadRequest());
	}

	private FlightCreateRequest validRequest() {
		return FlightCreateRequest.builder().flightNumber("AI301").airlineId(1L).fromPlace("Bangalore").toPlace("Delhi")
				.departureTime(LocalDateTime.of(2026, 6, 10, 10, 0)).arrivalTime(LocalDateTime.of(2026, 6, 10, 12, 30))
				.economySeats(100).businessSeats(20).ticketCost(BigDecimal.valueOf(5000)).mealType(MealType.VEG)
				.build();
	}

	@Test
	void updateSeats_shouldReturnOk() throws Exception {
		Map<String, Object> request = Map.of("availableSeats", 80);
		mockMvc.perform(patch("/api/v1.0/flights/1").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request))).andExpect(status().isOk());
	}
}