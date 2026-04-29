package com.flightapp.flightservice.airline.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flightapp.flightservice.airline.model.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

}
