package com.g1b.station_back.controller;

import com.g1b.station_back.dto.ItemDTO;
import com.g1b.station_back.dto.RestockableItemDTO;
import com.g1b.station_back.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('READ_ITEMS')")
    public ResponseEntity<List<ItemDTO>> getItems(@RequestParam(required = false) String typeName) {
        return ResponseEntity.ok(itemService.getAllItems(typeName));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_ITEMS')")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable Integer id) {
        ItemDTO item = itemService.getItemById(id);
        if (item != null) {
            return ResponseEntity.ok(item);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_ITEMS')")
    public ResponseEntity<ItemDTO> createItem(@RequestBody ItemDTO dto) {
        return ResponseEntity.ok(itemService.createItem(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_ITEMS')")
    public ResponseEntity<ItemDTO> updateItem(@PathVariable Integer id, @RequestBody ItemDTO dto) {
        ItemDTO updated = itemService.updateItem(id, dto);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_ITEMS')")
    public ResponseEntity<Void> deleteItem(@PathVariable Integer id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/restockables")
    @PreAuthorize("hasAuthority('READ_ITEMS')")
    public ResponseEntity<List<RestockableItemDTO>> getRestockableItems() {
        return ResponseEntity.ok(itemService.getRestockableItems());
    }

    // Keep the stock endpoint for compatibility if needed, but the generalized GetMapping handles ?typeName=fuel
    @GetMapping("/stock")
    @PreAuthorize("hasAuthority('READ_ITEMS')")
    public ResponseEntity<List<ItemDTO>> getStock() {
        return ResponseEntity.ok(itemService.getAllItems(null));
    }
}
