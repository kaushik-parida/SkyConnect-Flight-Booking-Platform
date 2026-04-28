package com.flightapp.authservice;

import com.flightapp.authservice.dto.CommonResponse;
import com.flightapp.authservice.dto.LoginRequest;
import com.flightapp.authservice.dto.LoginResponse;
import com.flightapp.authservice.dto.SignupRequest;
import com.flightapp.authservice.dto.SignupResponse;
import com.flightapp.authservice.entity.Role;
import com.flightapp.authservice.entity.User;
import com.flightapp.authservice.repository.UserRepository;
import com.flightapp.authservice.security.JwtUtil;
import com.flightapp.authservice.service.AuthServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@org.mockito.junit.jupiter.MockitoSettings(strictness = org.mockito.quality.Strictness.LENIENT)
class AuthServiceApplicationTests {

	@InjectMocks
	private AuthServiceImpl authService;

	@Mock
	private UserRepository userRepository;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private JwtUtil jwtUtil;

	@Test
	void testRegisterSuccess() {

		SignupRequest request = new SignupRequest();
		request.setFullName("Test User");
		request.setEmail("test@gmail.com");
		request.setPassword("12345");
		request.setPhoneNumber("9876543210");
		request.setGender("MALE");
		request.setDateOfBirth("2000-01-01");

		when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
		when(passwordEncoder.encode(anyString())).thenReturn("encodedPass");

		User savedUser = User.builder().id(1L).email(request.getEmail()).password("encodedPass").role(Role.USER)
				.build();

		when(userRepository.save(any(User.class))).thenReturn(savedUser);
		when(jwtUtil.generateToken(any(User.class))).thenReturn("mockToken");

		CommonResponse<SignupResponse> response = authService.register(request);

		assertTrue(response.isSuccess());
		assertEquals("test@gmail.com", response.getData().getEmail());
	}

	@Test
	void testLoginSuccess() {

		LoginRequest request = new LoginRequest();
		request.setUsernameOrEmail("test@gmail.com");
		request.setPassword("12345");

		User user = User.builder().id(1L).email("test@gmail.com").password("encodedPass").role(Role.USER).build();

		when(userRepository.findByEmail(request.getUsernameOrEmail())).thenReturn(Optional.of(user));

		when(passwordEncoder.matches(request.getPassword(), user.getPassword())).thenReturn(true);

		when(jwtUtil.generateToken(user)).thenReturn("mockToken");

		CommonResponse<LoginResponse> response = authService.login(request);

		assertTrue(response.isSuccess());
		assertEquals("mockToken", response.getData().getToken());
	}

	@Test
	void testRegisterDuplicateEmail() {

		SignupRequest request = new SignupRequest();
		request.setEmail("test@gmail.com");

		when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			authService.register(request);
		});

		assertEquals("Email already registered", exception.getMessage());
	}
}