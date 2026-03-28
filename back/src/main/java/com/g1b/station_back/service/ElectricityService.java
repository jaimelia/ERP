package com.g1b.station_back.service;

import com.g1b.station_back.dto.ElectricityDTO;
import com.g1b.station_back.model.Electricity;
import com.g1b.station_back.repository.ElectricityRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElectricityService {

	private final ElectricityRepository electricityRepository;

	public ElectricityService(ElectricityRepository electricityRepository) {
		this.electricityRepository = electricityRepository;
	}

	public List<ElectricityDTO> getElectricity() {
		return electricityRepository.findAll()
				.stream()
				.map(e -> new ElectricityDTO(e.getIdItem(), e.getName(), e.getNormalPrice(), e.getFastPrice()))
				.toList();
	}

	public ElectricityDTO createElectricity(ElectricityDTO dto) {
		Electricity electricity = new Electricity();
		electricity.setName(dto.name());
		electricity.setNormalPrice(dto.normalPrice());
		electricity.setFastPrice(dto.fastPrice());
		Electricity saved = electricityRepository.save(electricity);
		return new ElectricityDTO(saved.getIdItem(), saved.getName(), saved.getNormalPrice(), saved.getFastPrice());
	}

	public ElectricityDTO updateElectricity(Integer id, ElectricityDTO dto) {
		Electricity electricity = electricityRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Électricité introuvable : " + id));
		electricity.setName(dto.name());
		electricity.setNormalPrice(dto.normalPrice());
		electricity.setFastPrice(dto.fastPrice());
		Electricity saved = electricityRepository.save(electricity);
		return new ElectricityDTO(saved.getIdItem(), saved.getName(), saved.getNormalPrice(), saved.getFastPrice());
	}

	public void deleteElectricity(Integer id) {
		if (!electricityRepository.existsById(id)) {
			throw new EntityNotFoundException("Électricité introuvable : " + id);
		}
		electricityRepository.deleteById(id);
	}
}
