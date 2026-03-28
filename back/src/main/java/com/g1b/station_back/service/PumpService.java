package com.g1b.station_back.service;

import com.g1b.station_back.dto.FuelLevelDTO;
import com.g1b.station_back.dto.PumpDTO;
import com.g1b.station_back.model.Pump;
import com.g1b.station_back.model.enums.PumpChargerStatus;
import com.g1b.station_back.repository.PumpFuelRepository;
import com.g1b.station_back.repository.PumpRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PumpService {

    private final PumpRepository pumpRepository;
    private final PumpFuelRepository pumpFuelRepository;

    public PumpService(PumpRepository pumpRepository, PumpFuelRepository pumpFuelRepository) {
        this.pumpRepository = pumpRepository;
        this.pumpFuelRepository = pumpFuelRepository;
    }

    public List<PumpDTO> getAll() {
        return pumpRepository.findAll().stream().map(this::toDto).toList();
    }

    public PumpDTO toggleEnabled(Integer id, Boolean enabled) {
        Pump pump = findOrThrow(id);
        pump.setEnabled(enabled);
        return toDto(pumpRepository.save(pump));
    }

    public PumpDTO updateStatus(Integer id, PumpChargerStatus status) {
        Pump pump = findOrThrow(id);
        pump.setStatus(status);
        if (status == PumpChargerStatus.inUse && pump.getInUseAt() == null) {
            pump.setInUseAt(LocalDateTime.now());
        } else if (status != PumpChargerStatus.inUse) {
            pump.setInUseAt(null);
        }
        return toDto(pumpRepository.save(pump));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Pump findOrThrow(Integer id) {
        return pumpRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pompe introuvable : " + id));
    }

    private PumpDTO toDto(Pump pump) {
        List<FuelLevelDTO> fuelLevels = pumpFuelRepository.findByPump(pump).stream()
                .map(pf -> new FuelLevelDTO(
                        pf.getFuel().getName(),
                        pf.getAvailableVolume(),
                        pf.getMaxVolume()
                ))
                .toList();

        return new PumpDTO(
                pump.getIdPump(),
                pump.getIsAutomat(),
                pump.getStatus(),
                pump.getEnabled(),
                pump.getInUseAt(),
                fuelLevels
        );
    }
}
