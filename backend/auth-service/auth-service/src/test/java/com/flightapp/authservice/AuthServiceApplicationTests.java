package com.flightapp.authservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

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

@ExtendWith(MockitoExtension.class)
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

		User savedUser = User.builder().id(UUID.randomUUID()).email(request.getEmail()).password("encodedPass")
				.role(Role.USER).build();

		when(userRepository.save(any(User.class))).thenReturn(savedUser);

		CommonResponse<SignupResponse> response = authService.register(request);

		assertTrue(response.isSuccess());
		assertNotNull(response.getData().getUserId());
	}

	@Test
	void testRegisterDuplicateEmail() {
		SignupRequest request = new SignupRequest();
		request.setEmail("test@gmail.com");

		when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

		RuntimeException ex = assertThrows(RuntimeException.class, () -> {
			authService.register(request);
		});

		assertEquals("Email already registered", ex.getMessage());
	}

	@Test
	void testRegisterInvalidGender() {
		SignupRequest request = new SignupRequest();
		request.setEmail("test@gmail.com");
		request.setPassword("12345");
		request.setGender("INVALID");

		RuntimeException ex = assertThrows(RuntimeException.class, () -> {
			authService.register(request);
		});

		assertNotNull(ex);
	}

	@Test
	void testRegisterEmptyEmail() {
		SignupRequest request = new SignupRequest();
		request.setEmail("");

		RuntimeException ex = assertThrows(RuntimeException.class, () -> {
			authService.register(request);
		});

		assertNotNull(ex);
	}

	@Test
	void testRegisterNullPassword() {
		SignupRequest request = new SignupRequest();
		request.setEmail("test@gmail.com");
		request.setPassword(null);

		RuntimeException ex = assertThrows(RuntimeException.class, () -> {
			authService.register(request);
		});

		assertNotNull(ex);
	}

	@Test
	void testUserSavedInRepository() {
		SignupRequest request = new SignupRequest();
		request.setFullName("Test User");
		request.setEmail("test@gmail.com");
		request.setPassword("12345");
		request.setPhoneNumber("9876543210");
		request.setGender("MALE");
		request.setDateOfBirth("2000-01-01");

		when(userRepository.existsByEmail(anyString())).thenReturn(false);
		when(passwordEncoder.encode(anyString())).thenReturn("encoded");

		User savedUser = User.builder().id(UUID.randomUUID()).email("test@gmail.com").password("encoded")
				.role(Role.USER).build();

		when(userRepository.save(any(User.class))).thenReturn(savedUser);

		CommonResponse<SignupResponse> response = authService.register(request);

		assertNotNull(response);
		assertTrue(response.isSuccess());
		assertNotNull(response.getData());
	}

	@Test
	void testLoginSuccess() {
		LoginRequest request = new LoginRequest();
		request.setUsernameOrEmail("test@gmail.com");
		request.setPassword("12345");

		User user = User.builder().id(UUID.randomUUID()).email("test@gmail.com").password("encodedPass").role(Role.USER)
				.build();

		when(userRepository.findByEmail(request.getUsernameOrEmail())).thenReturn(Optional.of(user));
		when(passwordEncoder.matches(request.getPassword(), user.getPassword())).thenReturn(true);
		when(jwtUtil.generateToken(user)).thenReturn("mockToken");

		CommonResponse<LoginResponse> response = authService.login(request);

		assertTrue(response.isSuccess());
		assertEquals("mockToken", response.getData().getToken());
	}

	@Test
	void testLoginInvalidPassword() {
		LoginRequest request = new LoginRequest();
		request.setUsernameOrEmail("test@gmail.com");
		request.setPassword("wrongpass");

		User user = User.builder().id(UUID.randomUUID()).email("test@gmail.com").password("encodedPass").role(Role.USER)
				.build();

		when(userRepository.findByEmail(request.getUsernameOrEmail())).thenReturn(Optional.of(user));
		when(passwordEncoder.matches(request.getPassword(), user.getPassword())).thenReturn(false);

		RuntimeException ex = assertThrows(RuntimeException.class, () -> {
			authService.login(request);
		});

		assertEquals("Invalid password", ex.getMessage());
	}

	@Test
	void testLoginUserNotFound() {
		LoginRequest request = new LoginRequest();
		request.setUsernameOrEmail("notfound@gmail.com");

		when(userRepository.findByEmail(request.getUsernameOrEmail())).thenReturn(Optional.empty());

		RuntimeException ex = assertThrows(RuntimeException.class, () -> {
			authService.login(request);
		});

		assertEquals("User not found", ex.getMessage());
	}

	@Test
	void testLoginEmptyEmail() {
		LoginRequest request = new LoginRequest();
		request.setUsernameOrEmail("");

		RuntimeException ex = assertThrows(RuntimeException.class, () -> {
			authService.login(request);
		});

		assertNotNull(ex);
	}

	@Test
	void testLoginNullPassword() {
		LoginRequest request = new LoginRequest();
		request.setUsernameOrEmail("test@gmail.com");
		request.setPassword(null);

		RuntimeException ex = assertThrows(RuntimeException.class, () -> {
			authService.login(request);
		});

		assertNotNull(ex);
	}

	@Test
	void testLoginTokenNotNull() {
		LoginRequest request = new LoginRequest();
		request.setUsernameOrEmail("test@gmail.com");
		request.setPassword("12345");

		User user = User.builder().email("test@gmail.com").password("encodedPass").role(Role.USER).build();

		when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
		when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
		when(jwtUtil.generateToken(user)).thenReturn("token");

		CommonResponse<LoginResponse> response = authService.login(request);

		assertNotNull(response.getData().getToken());
	}

	@Test
	void testJwtTokenGeneration() {
		User user = User.builder().id(UUID.randomUUID()).email("test@gmail.com").role(Role.USER).build();

		when(jwtUtil.generateToken(user)).thenReturn("mockToken");

		String token = jwtUtil.generateToken(user);

		assertNotNull(token);
		assertEquals("mockToken", token);
	}

}
