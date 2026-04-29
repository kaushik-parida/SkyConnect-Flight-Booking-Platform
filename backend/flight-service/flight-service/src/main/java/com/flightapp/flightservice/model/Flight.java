package com.flightapp.flightservice.model;

import com.flightapp.flightservice.enums.FlightStatus;
import com.flightapp.flightservice.enums.MealType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long flightId;
    @Column(nullable = false, unique = true, length = 30)
    private String flightNumber;
    @Column(nullable = false)
    private Long airlineId;
    @Column(nullable = false,length=80)
    private String fromPlace;
    @Column(nullable =false, length =100)
    private String toPlace;
    @Column(nullable = false)
    private LocalDateTime departureTime;
    @Column(nullable = false)
    private LocalDateTime arrivalTime;
    @Column(nullable = false)
    private Integer economySeats;
    @Column(nullable = false)
    private Integer businessSeats;
    @Column(nullable = false)
    private BigDecimal ticketCost;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length=20)
    private MealType mealType;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FlightStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = FlightStatus.ACTIVE;
        }
    }
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}