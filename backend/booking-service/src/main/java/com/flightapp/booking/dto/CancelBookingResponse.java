package com.flightapp.booking.dto;

import java.time.LocalDateTime;
import com.flightapp.booking.model.BookingStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CancelBookingResponse {
	private Long bookingId;
	private String bookingReference;
	private BookingStatus status;
	private String message;
	private LocalDateTime cancelledAt;
}
