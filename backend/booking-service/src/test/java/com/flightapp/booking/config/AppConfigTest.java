package com.flightapp.booking.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

public class AppConfigTest {
	private final AppConfig appConfig = new AppConfig();
	
	@Test
	void loadBalancedWebClientBuilder_shouldReturnNonNullBuilder() {
		WebClient.Builder builder = appConfig.loadBalancedWebClientBuilder();
		assertThat(builder).isNotNull();
	}
	
	@Test
	void webClient_shouldBuildWithGivenBaseUrl() {
		WebClient.Builder builder = WebClient.builder();
		WebClient client = appConfig.webClient(builder, "http://loacalhost:8082");
		assertThat(client).isNotNull();
	}
}
