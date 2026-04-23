package com.flightapp.authservice.service;

import com.flightapp.authservice.dto.*;

public interface AuthService {

    CommonResponse<SignupResponse> register(SignupRequest request);

    CommonResponse<LoginResponse> login(LoginRequest request);
}