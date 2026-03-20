package com.g1b.station_back.repository;

import com.g1b.station_back.model.EvCharger;
import com.g1b.station_back.model.Pump;
import com.g1b.station_back.model.PumpFuel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PumpRepository extends JpaRepository<Pump, Integer> {}

