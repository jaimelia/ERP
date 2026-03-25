package com.g1b.station_back.service;

import com.g1b.station_back.dto.PostRestockDTO;
import com.g1b.station_back.dto.RestockDTO;
import com.g1b.station_back.model.Item;
import com.g1b.station_back.model.Restock;
import com.g1b.station_back.model.enums.RestockStatus;
import com.g1b.station_back.repository.FuelRepository;
import com.g1b.station_back.repository.ItemRepository;
import com.g1b.station_back.repository.RestockRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RestockService {

	private final RestockRepository restockRepository;
	private final FuelRepository fuelRepository;
	private final ItemRepository itemRepository;
	private final ItemService itemService;

	public RestockService(RestockRepository restockRepository, FuelRepository fuelRepository, ItemRepository itemRepository, ItemService itemService) {
		this.restockRepository = restockRepository;
		this.fuelRepository = fuelRepository;
		this.itemRepository = itemRepository;
		this.itemService = itemService;
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
						fuelRepository.findByIdItem(r.getItem().getIdItem()) != null ? "fuel" : "product"))
				.toList();
	}

	public RestockDTO createRestock(PostRestockDTO dto) {
		Item item = itemRepository.findById(dto.idItem())
				.orElseThrow(() -> new EntityNotFoundException("Article introuvable : " + dto.idItem()));

		Restock restock = new Restock();
		restock.setQuantity(dto.quantity());
		restock.setRestockDate(LocalDate.now());
		restock.setItem(item);
		restock.setStatus(RestockStatus.pending);
		Restock saved = restockRepository.save(restock);
		
		return new RestockDTO(
				saved.getIdRestock(),
				saved.getItem().getName(), 
				saved.getQuantity(), 
				saved.getStatus(), 
				saved.getRestockDate(),
				itemService.getItemType(item)
		);
	}

	public RestockDTO updateRestock(Integer id, RestockDTO dto) {
		Restock restock = restockRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Réapprovisionnement introuvable : " + id));
		Item item = itemRepository.findById(dto.id())
				.orElseThrow(() -> new EntityNotFoundException("Article introuvable : " + dto.id()));
		
		restock.setQuantity(dto.quantity());
		restock.setRestockDate(dto.date());
		restock.setItem(item);
		restock.setStatus(dto.status());
		Restock saved = restockRepository.save(restock);

		return new RestockDTO(
				saved.getIdRestock(),
				saved.getItem().getName(),
				saved.getQuantity(),
				saved.getStatus(),
				saved.getRestockDate(),
				itemService.getItemType(item)
		);
	}
}
