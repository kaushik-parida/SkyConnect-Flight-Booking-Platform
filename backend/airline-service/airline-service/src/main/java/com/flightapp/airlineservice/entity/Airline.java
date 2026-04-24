package com.flightapp.airlineservice.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "airlines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Airline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long airlineId;

    @Column(nullable = false)
    private String airlineName;

    @Column(nullable = false, unique = true)
    private String airlineCode;

    private String logoUrl;

    private String contactEmail;

    private String contactNumber;

    private boolean isBlocked = false;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}