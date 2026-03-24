package com.g1b.station_back.service;

import com.g1b.station_back.dto.FuelDTO;
import com.g1b.station_back.model.Fuel;
import com.g1b.station_back.repository.FuelRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuelService {

    private final FuelRepository fuelRepository;

    public FuelService(FuelRepository fuelRepository) {
        this.fuelRepository = fuelRepository;
    }

    public List<FuelDTO> getAllFuels() {
        return fuelRepository.findAll()
                .stream()
                .map(f -> new FuelDTO(f.getIdItem(), f.getName(), f.getPricePerLiter(), f.getStock(), f.getAlertThreshold()))
                .toList();
    }

    public FuelDTO updateFuel(Long id, FuelDTO dto) {
        Fuel fuel = fuelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carburant introuvable : " + id));
        fuel.setName(dto.getName());
        fuel.setPricePerLiter(dto.getPricePerLiter());
        fuel.setStock(dto.getStock());
        fuel.setAlertThreshold(dto.getAlertThreshold());
        Fuel saved = fuelRepository.save(fuel);
        return new FuelDTO(saved.getIdItem(), saved.getName(), saved.getPricePerLiter(), saved.getStock(), saved.getAlertThreshold());
    }
}
