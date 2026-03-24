package com.g1b.station_back.repository;

import com.g1b.station_back.model.EvCharger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvChargerRepository extends JpaRepository<EvCharger, Integer> {
	List<EvCharger> findAllByOrderByIsFastDescIdEvChargerAsc();
}