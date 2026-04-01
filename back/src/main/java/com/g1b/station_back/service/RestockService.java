package com.g1b.station_back.service;

import com.g1b.station_back.dto.PostRestockDTO;
import com.g1b.station_back.dto.RestockDTO;
import com.g1b.station_back.dto.UpdateThresholdsDTO;
import com.g1b.station_back.model.Fuel;
import com.g1b.station_back.model.Item;
import com.g1b.station_back.model.Product;
import com.g1b.station_back.model.Restock;
import com.g1b.station_back.model.enums.RestockStatus;
import com.g1b.station_back.repository.FuelRepository;
import com.g1b.station_back.repository.ItemRepository;
import com.g1b.station_back.repository.ProductRepository;
import com.g1b.station_back.repository.RestockRepository;

import jakarta.persistence.EntityNotFoundException;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RestockService {

	private final RestockRepository restockRepository;
	private final FuelRepository fuelRepository;
	private final ItemRepository itemRepository;
	private final ItemService itemService;
	private final ProductRepository productRepository;

	public RestockService(RestockRepository restockRepository, FuelRepository fuelRepository, ItemRepository itemRepository, ItemService itemService, ProductRepository productRepository) {
		this.restockRepository = restockRepository;
		this.fuelRepository = fuelRepository;
		this.itemRepository = itemRepository;
		this.itemService = itemService;
		this.productRepository = productRepository;
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
		if (dto.quantity().compareTo(new BigDecimal(0)) <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be greater than 0");
		}
		
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
	
	public void updateThresholds(UpdateThresholdsDTO[] dtos) {
		List<Fuel> fuels = new ArrayList<>();
		List<Product> products = new ArrayList<>();
		
		for (UpdateThresholdsDTO dto : dtos) {
			Fuel fuel = fuelRepository.findByIdItem(dto.idItem());
			if (fuel != null) {
				fuel.setAlertThreshold(dto.alertThreshold());
				fuel.setAutoRestockQuantity(dto.autoRestockQuantity());
				fuels.add(fuel);
			} else {

				Product product = productRepository.findByIdItem(dto.idItem());
				if (product != null) {
					product.setAlertThreshold(dto.alertThreshold().intValue());
					product.setAutoRestockQuantity(dto.autoRestockQuantity().intValue());
					products.add(product);
				}
			}
		}
		
		fuelRepository.saveAll(fuels);
		productRepository.saveAll(products);
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
