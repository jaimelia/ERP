package com.g1b.station_back.service;

import com.g1b.station_back.dto.PostRestockDTO;
import com.g1b.station_back.dto.RestockDTO;
import com.g1b.station_back.dto.UpdateThresholdsDTO;
import com.g1b.station_back.model.Item;
import com.g1b.station_back.model.Restock;
import com.g1b.station_back.model.enums.RestockStatus;
import com.g1b.station_back.repository.ItemRepository;
import com.g1b.station_back.repository.RestockRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RestockService {

    private final RestockRepository restockRepository;
    private final ItemRepository itemRepository;
    private final ItemService itemService;

    public RestockService(RestockRepository restockRepository, ItemRepository itemRepository, ItemService itemService) {
        this.restockRepository = restockRepository;
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
                        r.getItem().getType() != null ? r.getItem().getType().getName() : "N/A"))
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
                item.getType() != null ? item.getType().getName() : "N/A"
        );
    }

    public void updateThresholds(UpdateThresholdsDTO[] dtos) {
        List<Item> itemsToUpdate = new ArrayList<>();

        for (UpdateThresholdsDTO dto : dtos) {
            Item item = itemRepository.findById(dto.idItem())
                    .orElseThrow(() -> new EntityNotFoundException("Item not found: " + dto.idItem()));
            
            item.setAlertThreshold(dto.alertThreshold());
            item.setAutoRestockQuantity(dto.autoRestockQuantity());
            itemsToUpdate.add(item);
        }

        itemRepository.saveAll(itemsToUpdate);
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
                item.getType() != null ? item.getType().getName() : "N/A"
        );
    }
}
