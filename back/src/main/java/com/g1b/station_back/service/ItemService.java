package com.g1b.station_back.service;

import com.g1b.station_back.dto.ItemDTO;
import com.g1b.station_back.dto.ItemPriceDTO;
import com.g1b.station_back.dto.ItemTypeDTO;
import com.g1b.station_back.dto.RestockableItemDTO;
import com.g1b.station_back.model.Item;
import com.g1b.station_back.model.ItemPrice;
import com.g1b.station_back.model.ItemType;
import com.g1b.station_back.repository.ItemRepository;
import com.g1b.station_back.repository.ItemTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemTypeRepository itemTypeRepository;

    public List<ItemDTO> getAllItems(String typeName) {
        List<Item> items;
        if (typeName != null && !typeName.isEmpty()) {
            items = itemRepository.findByTypeName(typeName);
        } else {
            items = itemRepository.findAll();
        }
        return items.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ItemDTO getItemById(Integer id) {
        Optional<Item> itemOpt = itemRepository.findById(id);
        return itemOpt.map(this::convertToDTO).orElse(null);
    }

    public ItemDTO createItem(ItemDTO itemDTO) {
        Item item = convertToEntity(itemDTO);
        Item savedItem = itemRepository.save(item);
        return convertToDTO(savedItem);
    }

    public ItemDTO updateItem(Integer id, ItemDTO itemDTO) {
        Optional<Item> itemOpt = itemRepository.findById(id);
        if (itemOpt.isPresent()) {
            Item item = itemOpt.get();
            item.setName(itemDTO.getName());
            item.setStock(itemDTO.getStock());
            item.setAlertThreshold(itemDTO.getAlertThreshold());
            item.setAutoRestockQuantity(itemDTO.getAutoRestockQuantity());

            if (itemDTO.getType() != null && itemDTO.getType().getId() != null) {
                ItemType type = itemTypeRepository.findById(itemDTO.getType().getId()).orElse(null);
                item.setType(type);
            }

            if (itemDTO.getPrices() != null) {
                item.getPrices().clear();
                itemDTO.getPrices().forEach(priceDTO -> {
                    ItemPrice price = new ItemPrice(null, priceDTO.getPriceLabel(), priceDTO.getPrice(), item);
                    item.getPrices().add(price);
                });
            }

            Item updatedItem = itemRepository.save(item);
            return convertToDTO(updatedItem);
        }
        return null;
    }

    public void deleteItem(Integer id) {
        itemRepository.deleteById(id);
    }

    public List<RestockableItemDTO> getRestockableItems() {
        return itemRepository.findAll().stream()
                .filter(item -> item.getType() != null && item.getType().isStockManaged())
                .map(item -> new RestockableItemDTO(
                        item.getIdItem(),
                        item.getName(),
                        item.getStock(),
                        item.getAlertThreshold(),
                        item.getAutoRestockQuantity()
                ))
                .collect(Collectors.toList());
    }

    private ItemDTO convertToDTO(Item item) {
        ItemTypeDTO typeDTO = null;
        if (item.getType() != null) {
            typeDTO = new ItemTypeDTO(
                item.getType().getId(),
                item.getType().getName(),
                item.getType().getUnitOfMeasure(),
                item.getType().isStockManaged()
            );
        }

        List<ItemPriceDTO> priceDTOs = item.getPrices().stream()
                .map(price -> new ItemPriceDTO(price.getId(), price.getPriceLabel(), price.getPrice()))
                .collect(Collectors.toList());

        return new ItemDTO(
                item.getIdItem(),
                item.getName(),
                typeDTO,
                item.getStock(),
                item.getAlertThreshold(),
                item.getAutoRestockQuantity(),
                priceDTOs
        );
    }

    private Item convertToEntity(ItemDTO itemDTO) {
        ItemType type = null;
        if (itemDTO.getType() != null && itemDTO.getType().getId() != null) {
            type = itemTypeRepository.findById(itemDTO.getType().getId()).orElse(null);
        }

        Item item = new Item(
                itemDTO.getIdItem(),
                itemDTO.getName(),
                type,
                itemDTO.getStock(),
                itemDTO.getAlertThreshold(),
                itemDTO.getAutoRestockQuantity()
        );

        if (itemDTO.getPrices() != null) {
            List<ItemPrice> prices = itemDTO.getPrices().stream()
                    .map(priceDTO -> new ItemPrice(null, priceDTO.getPriceLabel(), priceDTO.getPrice(), item))
                    .collect(Collectors.toList());
            item.setPrices(prices);
        }

        return item;
    }
}
