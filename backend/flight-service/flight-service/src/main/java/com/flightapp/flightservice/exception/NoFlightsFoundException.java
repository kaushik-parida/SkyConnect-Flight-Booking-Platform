package com.flightapp.flightservice.exception;

public class NoFlightsFoundException extends RuntimeException {
    public NoFlightsFoundException(String message){
        super(message);
    }
}