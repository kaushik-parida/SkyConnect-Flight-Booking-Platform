package com.flightapp.flightservice.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.flightapp.flightservice.airline.controller.AirlineController;
import com.flightapp.flightservice.airline.service.AirlineService;
import com.flightapp.flightservice.airline.service.InventoryService;

@WebMvcTest(AirlineController.class)
public class AirlineContollerTest {
	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private AirlineService airlineService;

	@MockBean
	private InventoryService inventoryService;

	@Test
	void registerAirline() throws Exception {

		when(airlineService.createAirline(org.mockito.ArgumentMatchers.any())).thenReturn(1L);

		mockMvc.perform(post("/api/v1.0/airline/register").contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"Indigo\",\"logoUrl\":\"logo.png\"}")).andExpect(status().isOk());
	}

	@Test
	void blockAirline() throws Exception {

		mockMvc.perform(put("/api/v1.0/airline/1").contentType(MediaType.APPLICATION_JSON).content("\"BLOCKED\""))
				.andExpect(status().isOk());
	}

	@Test
	void addInventory() throws Exception {

		when(inventoryService.addInventory(any())).thenReturn(1L);

		mockMvc.perform(post("/api/v1.0/airline/inventory/add").contentType(MediaType.APPLICATION_JSON).content("""
				{
				  "airlineId": 1,
				  "flightNumber": "AI101",
				  "source": "Bangalore",
				  "destination": "Delhi",
				  "economySeats": 120,
				  "businessSeats": 20
				}
				""")).andExpect(status().isOk());
	}

	@Test
	void registerAirline_EmptyBody() throws Exception {

		mockMvc.perform(post("/api/v1.0/airline/register")
				.contentType(org.springframework.http.MediaType.APPLICATION_JSON).content("{}"))
				.andExpect(status().isBadRequest());
	}
}
