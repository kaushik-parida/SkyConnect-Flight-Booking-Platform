package com.flightapp.booking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final GatewayHeaderFilter gatewayHeaderFilter;

	public SecurityConfig(GatewayHeaderFilter gatewayHeaderFilter) {
		this.gatewayHeaderFilter = gatewayHeaderFilter;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) {
		try {
			http.csrf(csrf -> csrf.disable())
					.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
					.authorizeHttpRequests(auth -> auth.requestMatchers("/api/v1.0/flight/booking/admin/**")
							.hasRole("ADMIN").requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
							.permitAll().anyRequest().authenticated())
					.addFilterBefore(gatewayHeaderFilter, UsernamePasswordAuthenticationFilter.class);

			return http.build();
		} catch (Exception e) {
			throw new RuntimeException("Failed to configure security filter chain", e);
		}
	}
}
