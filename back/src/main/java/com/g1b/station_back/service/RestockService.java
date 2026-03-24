package com.g1b.station_back.service;

import com.g1b.station_back.dto.RestockDTO;
import com.g1b.station_back.model.Item;
import com.g1b.station_back.model.Restock;
import com.g1b.station_back.repository.ItemRepository;
import com.g1b.station_back.repository.RestockRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestockService {

    private final RestockRepository restockRepository;
    private final ItemRepository itemRepository;

    public RestockService(RestockRepository restockRepository, ItemRepository itemRepository) {
        this.restockRepository = restockRepository;
        this.itemRepository = itemRepository;
    }

    public List<RestockDTO> getAllRestocks() {
        return restockRepository.findAll()
                .stream()
                .map(r -> new RestockDTO(
                        r.getIdRestock(),
                        r.getQuantity(),
                        r.getRestockDate(),
                        r.getItem().getIdItem(),
                        r.getItem().getName(),
                        r.getItem().getItemType(),
                        r.getStatus()))
                .toList();
    }

    public RestockDTO createRestock(RestockDTO dto) {
        Item item = itemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new EntityNotFoundException("Article introuvable : " + dto.getItemId()));
        Restock restock = new Restock();
        restock.setQuantity(dto.getQuantity());
        restock.setRestockDate(dto.getRestockDate());
        restock.setItem(item);
        restock.setStatus(dto.getStatus());
        Restock saved = restockRepository.save(restock);
        return new RestockDTO(saved.getIdRestock(), saved.getQuantity(), saved.getRestockDate(),
                saved.getItem().getIdItem(), saved.getItem().getName(), saved.getItem().getItemType(), saved.getStatus());
    }

    public RestockDTO updateRestock(Integer id, RestockDTO dto) {
        Restock restock = restockRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Réapprovisionnement introuvable : " + id));
        Item item = itemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new EntityNotFoundException("Article introuvable : " + dto.getItemId()));
        restock.setQuantity(dto.getQuantity());
        restock.setRestockDate(dto.getRestockDate());
        restock.setItem(item);
        restock.setStatus(dto.getStatus());
        Restock saved = restockRepository.save(restock);
        return new RestockDTO(saved.getIdRestock(), saved.getQuantity(), saved.getRestockDate(),
                saved.getItem().getIdItem(), saved.getItem().getName(), saved.getItem().getItemType(), saved.getStatus());
    }

    public void deleteRestock(Integer id) {
        if (!restockRepository.existsById(id)) {
            throw new EntityNotFoundException("Réapprovisionnement introuvable : " + id);
        }
        restockRepository.deleteById(id);
    }
}
