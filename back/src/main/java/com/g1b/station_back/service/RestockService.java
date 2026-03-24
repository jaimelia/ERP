package com.g1b.station_back.service;

import com.g1b.station_back.dto.EvChargerDTO;
import com.g1b.station_back.dto.RestockDTO;
import com.g1b.station_back.repository.EvChargerRepository;
import com.g1b.station_back.repository.FuelRepository;
import com.g1b.station_back.repository.ProductRepository;
import com.g1b.station_back.repository.RestockRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestockService {

	private final RestockRepository restockRepository;
	private final FuelRepository fuelRepository;

	public RestockService(RestockRepository restockRepository, FuelRepository fuelRepository) {
		this.restockRepository = restockRepository;
		this.fuelRepository = fuelRepository;
	}

	public List<RestockDTO> getAllRestocks() {
		return restockRepository.findAll()
				.stream()
				.map(r -> new RestockDTO(
						r.getIdRestock(),
						r.getItem().getName(),
						r.getQuantity(),
						r.getStatus(),
						r.getRestockDate(),
						!fuelRepository.findByIdItem(r.getItem().getIdItem()).isEmpty() ? "fuel" : "product"))
				.toList();
	}
}