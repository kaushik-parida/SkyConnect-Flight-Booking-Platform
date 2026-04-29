package com.flightapp.flightservice.config;

import org.springframework.context.annotation.Bean;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

public class OpenApiConfig {
	@Bean
	public OpenAPI flightServiceOpenAPI() {
		return new OpenAPI().info(
				new Info().title("SkyConnect Flighht Service API ").description("APIs for flight search and flight add")
						.version("1.0").contact(new Contact().name("SkyConnect Team")));

	}

}
