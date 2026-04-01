package com.g1b.station_back.repository;

import com.g1b.station_back.model.Pump;
import com.g1b.station_back.model.PumpFuel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PumpFuelRepository extends JpaRepository<PumpFuel, Integer> {
    List<PumpFuel> findByPump(Pump pump);
    void deleteByFuel_IdItem(Integer fuelId);
}
