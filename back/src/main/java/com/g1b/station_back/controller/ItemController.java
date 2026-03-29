package com.g1b.station_back.controller;

import com.g1b.station_back.dto.*;
import com.g1b.station_back.service.ElectricityService;
import com.g1b.station_back.service.FuelService;
import com.g1b.station_back.service.ItemService;
import com.g1b.station_back.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

	private final ItemService itemService;
    private final ProductService productService;
    private final FuelService fuelService;
	private final ElectricityService electricityService;

	public ItemController(ItemService itemService, ProductService productService, FuelService fuelService, ElectricityService electricityService) {
		this.itemService = itemService;
        this.productService = productService;
        this.fuelService = fuelService;
		this.electricityService = electricityService;
	}

	@GetMapping("/restockables")
	@PreAuthorize("hasAuthority('READ_ITEMS')")
	public ResponseEntity<List<RestockableItemDTO>> getRestockableItems() {
		return ResponseEntity.ok(itemService.getRestockableItems());
	}

    // ── Produits ──────────────────────────────────────────────────────────────

    @PostMapping("/products")
	@PreAuthorize("hasAuthority('CREATE_ITEMS')")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    @PutMapping("/products/{id}")
	@PreAuthorize("hasAuthority('UPDATE_ITEMS')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @DeleteMapping("/products/{id}")
	@PreAuthorize("hasAuthority('DELETE_ITEMS')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // ── Carburants ────────────────────────────────────────────────────────────

	@PostMapping("/fuels")
	@PreAuthorize("hasAuthority('CREATE_ITEMS')")
	public ResponseEntity<FuelDTO> createFuel(@RequestBody FuelDTO dto) {
		return ResponseEntity.ok(fuelService.createFuel(dto));
	}

    @PutMapping("/fuels/{id}")
	@PreAuthorize("hasAuthority('UPDATE_ITEMS')")
    public ResponseEntity<FuelDTO> updateFuel(@PathVariable Long id, @RequestBody FuelDTO dto) {
        return ResponseEntity.ok(fuelService.updateFuel(id, dto));
    }

    @DeleteMapping("/fuels/{id}")
	@PreAuthorize("hasAuthority('DELETE_ITEMS')")
    public ResponseEntity<Void> deleteFuel(@PathVariable Long id) {
        fuelService.deleteFuel(id);
        return ResponseEntity.noContent().build();
    }

    // ── Stock combiné (Produits + Carburants) ─────────────────────────────────

    @GetMapping("/stock")
	@PreAuthorize("hasAuthority('READ_ITEMS')")
    public ResponseEntity<List<ItemDTO>> getStock() {
        List<ItemDTO> stock = new ArrayList<>();

        productService.getAllProducts().forEach(p ->
                stock.add(new ItemDTO(
                        p.idItem(),
                        p.name(),
                        BigDecimal.valueOf(p.stock()),
                        p.unitPrice(),
						"product")));

        fuelService.getAllFuels().forEach(f ->
                stock.add(new ItemDTO(
                        f.idItem(),
                        f.name(),
                        f.stock(),
                        f.price(),
                        "fuel")));

        return ResponseEntity.ok(stock);
    }

	@GetMapping("/electricity")
	@PreAuthorize("hasAuthority('READ_ITEMS')")
	public ResponseEntity<List<ElectricityDTO>> getElectricity() {
		return ResponseEntity.ok(electricityService.getElectricity());
	}

	@PostMapping("/electricity")
	@PreAuthorize("hasAuthority('CREATE_ITEMS')")
	public ResponseEntity<ElectricityDTO> createElectricity(@RequestBody ElectricityDTO dto) {
		return ResponseEntity.ok(electricityService.createElectricity(dto));
	}

	@PutMapping("/electricity/{id}")
	@PreAuthorize("hasAuthority('UPDATE_ITEMS')")
	public ResponseEntity<ElectricityDTO> updateElectricity(@PathVariable Integer id, @RequestBody ElectricityDTO dto) {
		return ResponseEntity.ok(electricityService.updateElectricity(id, dto));
	}

	@DeleteMapping("/electricity/{id}")
	@PreAuthorize("hasAuthority('DELETE_ITEMS')")
	public ResponseEntity<Void> deleteElectricity(@PathVariable Integer id) {
		electricityService.deleteElectricity(id);
		return ResponseEntity.noContent().build();
	}
}
