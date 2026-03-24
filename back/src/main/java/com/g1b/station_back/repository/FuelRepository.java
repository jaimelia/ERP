package com.g1b.station_back.repository;

import com.g1b.station_back.model.Fuel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuelRepository extends JpaRepository<Fuel, Long> {
	List<Fuel> findByIdItem(Integer idItem);
}