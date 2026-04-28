package com.flightapp.flightservice.airline.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.flightapp.flightservice.airline.enums.AirlineStatus;

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
	private String name;

	private String logoUrl;

	@Enumerated(EnumType.STRING)
	private AirlineStatus status;

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
		if (this.status == null) {
			this.status = AirlineStatus.ACTIVE;
		}
	}

	@PreUpdate
	public void preUpdate() {
		this.updatedAt = LocalDateTime.now();
	}
}