package com.flightapp.flightservice;

import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

@Suite
@SuiteDisplayName("Flight Service Test Suite")
@SelectPackages("com.flightapp.flightservice")
public class FlightServiceTestSuite {

}