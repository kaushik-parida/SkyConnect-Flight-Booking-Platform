package com.flightapp.booking.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI skyConnectOpenAPI() {
		return new OpenAPI()
				.info(new Info().title("SkyConnect Booking Service API")
						.description("Microservice for managing flight bookings in the SkyConnect platform")
						.version("v1.0").contact(new Contact().name("SkyConnect Team")))
				.servers(List.of(new Server().url("http://localhost:8084").description("Local development"),
						new Server().url("http://api-gateway:8080").description("Via API Gateway")));
	}
}