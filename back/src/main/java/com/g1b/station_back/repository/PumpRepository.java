package com.g1b.station_back.repository;

import com.g1b.station_back.model.EvCharger;
import com.g1b.station_back.model.Pump;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PumpRepository extends JpaRepository<Pump, Integer> {
	List<Pump> findAllByOrderByIdPumpAsc();
}

