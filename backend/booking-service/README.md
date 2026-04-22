# Booking Service

This service handles basic booking operations for the SkyConnect Flight Booking Platform.

It is a Spring Boot application built with a layered structure (controller → service → repository) and currently supports creating and fetching bookings.

---

## Current Scope

This is the **initial version** of the booking service.

Right now, it includes:

* Create a booking
* Fetch booking details by ID
* Basic DTO structure for request/response
* Controller, service, and repository layers
* Initial test setup

---

## Project Structure

```
src/main/java/com/flightapp/booking
├── controller
├── service
├── service/implementation
├── repository
├── model
├── dto
├── exception
├── config
```

---

## Tech Stack

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Maven

---

## Running the Service

From the project root:

```bash
cd backend/booking-service
./mvnw spring-boot:run
```

---

## Notes

* This is a starting point and will be expanded further.
* Future improvements will include better validation, integrations with other services, and handling real-world booking scenarios.

---

## Author

Kaushik Parida
