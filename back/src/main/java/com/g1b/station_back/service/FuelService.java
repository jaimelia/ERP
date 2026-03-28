package com.g1b.station_back.service;

import com.g1b.station_back.dto.FuelDTO;
import com.g1b.station_back.model.Fuel;
import com.g1b.station_back.repository.FuelRepository;
import com.g1b.station_back.repository.PumpFuelRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FuelService {

    private final FuelRepository fuelRepository;
    private final PumpFuelRepository pumpFuelRepository;

    public FuelService(FuelRepository fuelRepository, PumpFuelRepository pumpFuelRepository) {
        this.fuelRepository = fuelRepository;
        this.pumpFuelRepository = pumpFuelRepository;
    }

    public List<FuelDTO> getAllFuels() {
        return fuelRepository.findAll()
                .stream()
                .map(f -> new FuelDTO(f.getIdItem(), f.getName(), f.getPricePerLiter(), f.getStock()))
                .toList();
    }

    public FuelDTO createFuel(FuelDTO dto) {
        Fuel fuel = new Fuel();
        fuel.setName(dto.name());
        fuel.setPricePerLiter(dto.price());
        fuel.setStock(dto.stock());
        Fuel saved = fuelRepository.save(fuel);
        return new FuelDTO(saved.getIdItem(), saved.getName(), saved.getPricePerLiter(), saved.getStock());
    }

    public FuelDTO updateFuel(Long id, FuelDTO dto) {
        Fuel fuel = fuelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carburant introuvable : " + id));
        fuel.setName(dto.name());
        fuel.setPricePerLiter(dto.price());
        fuel.setStock(dto.stock());
        Fuel saved = fuelRepository.save(fuel);
        return new FuelDTO(saved.getIdItem(), saved.getName(), saved.getPricePerLiter(), saved.getStock());
    }

    @Transactional
    public void deleteFuel(Long id) {
        if (!fuelRepository.existsById(id)) {
            throw new EntityNotFoundException("Carburant introuvable : " + id);
        }
        pumpFuelRepository.deleteByFuel_IdItem(id.intValue());
        fuelRepository.deleteById(id);
    }
}
