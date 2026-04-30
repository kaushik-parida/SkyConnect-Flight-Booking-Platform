# SkyConnect Configuration Repository

This repository holds the centralized configuration properties for all microservices in the SkyConnect Flight Booking Platform. It is served dynamically to the microservices via the Spring Cloud Config Server.

## How to Add or Update Your Service's Properties

1. **Create your file**: The file name must match your `spring.application.name`. For example, if your service is named `auth-service`, your file should be `auth-service.properties`.
2. **Add standard properties**: Put all non-sensitive configuration (like database URLs, server ports, and logging levels) directly into the file as plain text.

### Handling Sensitive Data (Passwords, Secrets)

Never commit plain-text passwords or secrets to this repository! Instead, encrypt them using the Config Server.

1. Ensure the Config Server is running locally on port `8888`.
2. Open Postman or your terminal and send a `POST` request to the `/encrypt` endpoint with your plain-text secret in the body.
   
   **cURL Example:**
   ```bash
   curl -X POST http://localhost:8888/encrypt -d "mySuperSecretPassword123"
   ```
3. The server will return a long encrypted string (e.g., `fa49f973c332...`).
4. In your `.properties` file, prepend `{cipher}` to the encrypted string. Do **not** use quotes around it.

   **Correct Example:**
   ```properties
   spring.datasource.password={cipher}fa49f973c332fddc1d81a24d212209bf2457e122bf2f598c8ac194fedf014f91
   jwt.secret={cipher}5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
   ```

### Connecting Your Microservice to Config Server

To pull these configurations, ensure your microservice has the `spring-cloud-starter-config` dependency in its `pom.xml` and add the following to its `application.properties`:

```properties
spring.application.name=your-service-name
spring.config.import=configserver:http://localhost:8888/

# Recommended: Fail immediately if Config Server is down
spring.cloud.config.fail-fast=true
```

## Pushing Changes
The Config Server pulls changes directly from the `main` branch of this repository. **Any updates you make to these files must be committed and pushed to GitHub before the Config Server can serve them.** You do not need to restart the Config Server after pushing changes.