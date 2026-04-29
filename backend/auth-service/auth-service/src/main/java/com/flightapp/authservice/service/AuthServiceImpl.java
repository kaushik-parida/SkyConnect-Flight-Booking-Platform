package com.flightapp.authservice.service;

import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flightapp.authservice.dto.CommonResponse;
import com.flightapp.authservice.dto.LoginRequest;
import com.flightapp.authservice.dto.LoginResponse;
import com.flightapp.authservice.dto.SignupRequest;
import com.flightapp.authservice.dto.SignupResponse;
import com.flightapp.authservice.dto.UserInfo;
import com.flightapp.authservice.entity.Role;
import com.flightapp.authservice.entity.User;
import com.flightapp.authservice.repository.UserRepository;
import com.flightapp.authservice.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    
    @Override
    public CommonResponse<SignupResponse> register(SignupRequest request) {

        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .gender(request.getGender())
                .dateOfBirth(LocalDate.parse(request.getDateOfBirth()))
                .role(Role.USER)
                .enabled(true)
                .build();

        
        User savedUser = userRepository.save(user);

        
        SignupResponse signupResponse = SignupResponse.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .build();

        return CommonResponse.<SignupResponse>builder()
                .success(true)
                .message("User registered successfully")
                .data(signupResponse)
                .build();
    }

    
    @Override
    public CommonResponse<LoginResponse> login(LoginRequest request) {

      
        User user = userRepository.findByEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        
        String token = jwtUtil.generateToken(user);

        
        LoginResponse loginResponse = LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(3600)
                .role(user.getRole().name())
                .user(UserInfo.builder()
                        .userId(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .build())
                .build();

        return CommonResponse.<LoginResponse>builder()
                .success(true)
                .data(loginResponse)
                .build();
    }
}