package com.g1b.station_back.repository;

import com.g1b.station_back.model.Electricity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElectricityRepository extends JpaRepository<Electricity, Integer> {}
