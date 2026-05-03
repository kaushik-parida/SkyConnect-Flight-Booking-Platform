package com.flightapp.booking.test.suite;

import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

import com.flightapp.booking.client.FlightServiceClientTest;
import com.flightapp.booking.config.AppConfigTest;
import com.flightapp.booking.controller.BookingControllerTest;
import com.flightapp.booking.exception.GlobalExceptionHandlerTest;
import com.flightapp.booking.service.implementation.BookingServiceImplementationTest;

@Suite
@SuiteDisplayName("Cross-Package Booking Suite")
@SelectClasses({ BookingControllerTest.class, BookingServiceImplementationTest.class, FlightServiceClientTest.class,
		GlobalExceptionHandlerTest.class, AppConfigTest.class })
public class BookingTestSuite {
}
