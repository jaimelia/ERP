package com.g1b.station_back.service;

import com.g1b.station_back.dto.RestockableItemDTO;
import com.g1b.station_back.model.Item;
import com.g1b.station_back.repository.ElectricityRepository;
import com.g1b.station_back.repository.FuelRepository;
import com.g1b.station_back.repository.ItemRepository;
import com.g1b.station_back.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ItemService {
	private final ItemRepository itemRepository;
	private final FuelRepository fuelRepository;
	private final ProductRepository productRepository;
	private final ElectricityRepository electricityRepository;

	public ItemService(ItemRepository itemRepository, FuelRepository fuelRepository, ProductRepository productRepository, ElectricityRepository electricityRepository) {
		this.itemRepository = itemRepository;
		this.fuelRepository = fuelRepository;
		this.productRepository = productRepository;
		this.electricityRepository = electricityRepository;
	}
	
	public List<RestockableItemDTO> getRestockableItems() {
		List<RestockableItemDTO> items = new ArrayList<>(fuelRepository.findAll()
				.stream()
				.map(fuel -> new RestockableItemDTO(fuel.getIdItem(), fuel.getName(), fuel.getPricePerLiter(), fuel.getStock(), "fuel", fuel.getAlertThreshold(), fuel.getAutoRestockQuantity()))
				.toList());

		items.addAll(productRepository.findAll()
				.stream()
				.map(product -> new RestockableItemDTO(product.getIdItem(), product.getName(), product.getUnitPrice(), new BigDecimal(product.getStock()), "product", new BigDecimal(product.getAlertThreshold()), new BigDecimal(product.getAutoRestockQuantity())))
				.toList());
		
		return items;
	}

	public String getItemType(Item item) {
		if (fuelRepository.findByIdItem(item.getIdItem()) != null) {
			return "fuel";
		} else if (productRepository.findByIdItem(item.getIdItem()) != null) {
			return "product";
		} else {
			return "electricity";
		}
	}
}
