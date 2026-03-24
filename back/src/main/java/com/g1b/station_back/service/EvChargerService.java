package com.g1b.station_back.service;

import com.g1b.station_back.dto.EvChargerDTO;
import com.g1b.station_back.repository.EvChargerRepository;

import org.springframework.stereotype.Service;

import java.util.List;

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
}