package com.flightapp.flightservice.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return errors;
    }
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public Map<String, String> handleBadRequest(IllegalArgumentException exception) {
        Map<String, String> error = new HashMap<>();
        error.put("error", exception.getMessage());
        return error;
    }
    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public Map<String, String> handleConflict(DataIntegrityViolationException exception) {
        Map<String,String> error = new HashMap<>();
        error.put("error","Duplicate or invalid data");
        return error;
    }
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NoFlightsFoundException.class)
    public Map<String, String> handleNoFlightsFound(NoFlightsFoundException exception) {
        Map<String,String> error = new HashMap<>();
        error.put("error", exception.getMessage());
        return error;
    }
}