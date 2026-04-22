package com.flightapp.booking.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private void createBooking() throws Exception {
        mockMvc.perform(post("/api/v1.0/flight/booking")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"flightId\":1,\"seatCount\":2}"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateBooking() throws Exception {
        mockMvc.perform(post("/api/v1.0/flight/booking")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"flightId\":2,\"seatCount\":1}"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllBookings() throws Exception {
        createBooking();

        mockMvc.perform(get("/api/v1.0/flight/booking"))
                .andExpect(status().isOk());
    }
}