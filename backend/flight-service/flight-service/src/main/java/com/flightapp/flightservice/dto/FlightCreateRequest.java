package com.flightapp.flightservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.flightapp.flightservice.enums.MealType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightCreateRequest {
    @NotBlank()
    @Size()
    private String flightNumber;
    @NotNull()
    @Positive()
    private Long airlineId;
    @NotBlank()
    @Size(max = 80)
    @Pattern(regexp = "^[A-Za-z ]+$",message = "From must contain only letters")
    private String from;
    @NotBlank()
    @Size(max=80)
    @Pattern(regexp = "^[A-Za-z ]+$",message = "To must contain only letters")
    private String to;
    @NotNull()
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime departureTime;
    @NotNull()
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime arrivalTime;
    @NotNull()
    @Min(value=0)
    private Integer economySeats;
    @NotNull()
    @Min(value=0,message="Value cannot be negative")
    private Integer businessSeats;
    @NotNull()
    @Min(value=0,message="Value cannot be negative")
    private Integer availableSeats;
    @NotNull()
    @Min(value=0,message="Value cannot be negative")
    private Float ticketCost;
    @NotNull()
    private MealType mealType;
}