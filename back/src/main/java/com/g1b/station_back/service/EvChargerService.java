package com.g1b.station_back.service;

import com.g1b.station_back.dto.EvChargerDTO;
import com.g1b.station_back.model.EvCharger;
import com.g1b.station_back.model.Pump;
import com.g1b.station_back.model.enums.PumpChargerStatus;
import com.g1b.station_back.repository.EvChargerRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;

@Service
public class EvChargerService {

	private final EvChargerRepository evChargerRepository;

	public EvChargerService(EvChargerRepository evChargerRepository) {
		this.evChargerRepository = evChargerRepository;
	}

	public List<EvChargerDTO> getAllChargers() {
		return evChargerRepository.findAllByOrderByIsFastDescIdEvChargerAsc()
				.stream()
				.map(c -> new EvChargerDTO(c.getIdEvCharger(), c.getIsFast(), c.getStatus()))
				.toList();
	}
	
	public EvChargerDTO updateStatus(Integer id, PumpChargerStatus status) {
		EvCharger charger = evChargerRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Chargeur introuvable : " + id));
		charger.setStatus(status);
		EvCharger updatedCharger = evChargerRepository.save(charger);
		return new EvChargerDTO(updatedCharger.getIdEvCharger(), updatedCharger.getIsFast(), updatedCharger.getStatus());
	}
}