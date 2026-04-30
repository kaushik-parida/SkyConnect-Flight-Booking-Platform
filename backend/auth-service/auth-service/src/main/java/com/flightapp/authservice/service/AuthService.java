package com.flightapp.authservice.service;

import com.flightapp.authservice.dto.CommonResponse;
import com.flightapp.authservice.dto.LoginRequest;
import com.flightapp.authservice.dto.LoginResponse;
import com.flightapp.authservice.dto.SignupRequest;
import com.flightapp.authservice.dto.SignupResponse;
import com.flightapp.authservice.dto.UserResponse;

public interface AuthService {

	CommonResponse<SignupResponse> register(SignupRequest request);

	CommonResponse<LoginResponse> login(LoginRequest request);

	UserResponse getUserById(String userId);
}