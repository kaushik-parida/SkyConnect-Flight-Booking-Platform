package com.flightapp.booking.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.flightapp.booking.dto.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(BookingNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleBookingNotFound(BookingNotFoundException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler(FlightNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleFlightNotFound(FlightNotFoundException ex, HttpServletRequest request) {
		return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler(InsufficientSeatsException.class)
	public ResponseEntity<ErrorResponse> handleInsufficientSeats(InsufficientSeatsException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler(FlightNotActiveException.class)
	public ResponseEntity<ErrorResponse> handleFlightNotActive(FlightNotActiveException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler(FlightServiceUnavailableException.class)
	public ResponseEntity<ErrorResponse> handleFlightServiceUnavailable(FlightServiceUnavailableException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler(DuplicateBookingException.class)
	public ResponseEntity<ErrorResponse> handleDuplicateBooking(DuplicateBookingException ex, HttpServletRequest req) {
		return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), req.getRequestURI());
	}

	@ExceptionHandler(CancellationNotAllowedException.class)
	public ResponseEntity<ErrorResponse> handleCancellationNotAllowedException(CancellationNotAllowedException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler(BookingAlreadyCancelledException.class)
	public ResponseEntity<ErrorResponse> handleAlreadyCancelled(BookingAlreadyCancelledException ex,
			HttpServletRequest req) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
	}

	@ExceptionHandler(UnauthorizedBookingAccessException.class)
	public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedBookingAccessException ex,
			HttpServletRequest req) {
		return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage(), req.getRequestURI());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex,
			HttpServletRequest request) {
		String message = ex.getBindingResult().getFieldErrors().stream()
				.map(err -> err.getField() + ": " + err.getDefaultMessage()).findFirst().orElse("Validation failed");
		return buildResponse(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
	}

	@ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(
			org.springframework.http.converter.HttpMessageNotReadableException ex, HttpServletRequest request) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Malformed JSON request or invalid data format",
				request.getRequestURI());
	}

	@ExceptionHandler(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ErrorResponse> handleTypeMismatch(
			org.springframework.web.method.annotation.MethodArgumentTypeMismatchException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Invalid parameter type: " + ex.getName(),
				request.getRequestURI());
	}

	@ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
	public ResponseEntity<ErrorResponse> handleConstraintViolation(jakarta.validation.ConstraintViolationException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Validation failed: " + ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ErrorResponse> handleMethodNotSupported(
			org.springframework.web.HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
		return buildResponse(HttpStatus.METHOD_NOT_ALLOWED, ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
	public ResponseEntity<ErrorResponse> handleNoResourceFound(
			org.springframework.web.servlet.resource.NoResourceFoundException ex, HttpServletRequest request) {
		return buildResponse(HttpStatus.NOT_FOUND, "The requested API endpoint does not exist",
				request.getRequestURI());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, HttpServletRequest request) {
		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", request.getRequestURI());
	}

	private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message, String path) {
		ErrorResponse error = ErrorResponse.builder().status(status.value()).message(message).path(path)
				.timestamp(LocalDateTime.now()).build();
		return ResponseEntity.status(status).body(error);
	}
}