package com.g1b.station_back.controller;

import com.g1b.station_back.dto.FuelDTO;
import com.g1b.station_back.dto.ProductDTO;
import com.g1b.station_back.dto.RestockDTO;
import com.g1b.station_back.dto.StockItemDTO;
import com.g1b.station_back.service.FuelService;
import com.g1b.station_back.service.ProductService;
import com.g1b.station_back.service.RestockService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/merchandise")
public class MerchandiseController {

    private final ProductService productService;
    private final FuelService fuelService;
    private final RestockService restockService;

    public MerchandiseController(ProductService productService, FuelService fuelService, RestockService restockService) {
        this.productService = productService;
        this.fuelService = fuelService;
        this.restockService = restockService;
    }

    // ── Produits ──────────────────────────────────────────────────────────────

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping("/products")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // ── Carburants ────────────────────────────────────────────────────────────

    @GetMapping("/fuels")
    public ResponseEntity<List<FuelDTO>> getAllFuels() {
        return ResponseEntity.ok(fuelService.getAllFuels());
    }

    @PutMapping("/fuels/{id}")
    public ResponseEntity<FuelDTO> updateFuel(@PathVariable Long id, @RequestBody FuelDTO dto) {
        return ResponseEntity.ok(fuelService.updateFuel(id, dto));
    }

    @DeleteMapping("/fuels/{id}")
    public ResponseEntity<Void> deleteFuel(@PathVariable Long id) {
        fuelService.deleteFuel(id);
        return ResponseEntity.noContent().build();
    }

    // ── Stock combiné (Produits + Carburants) ─────────────────────────────────

    @GetMapping("/stock")
    public ResponseEntity<List<StockItemDTO>> getStock() {
        List<StockItemDTO> stock = new ArrayList<>();

        productService.getAllProducts().forEach(p ->
                stock.add(new StockItemDTO(
                        "Produit",
                        p.getIdItem() != null ? p.getIdItem().longValue() : null,
                        p.getName(),
                        p.getStock() != null ? BigDecimal.valueOf(p.getStock()) : null,
                        p.getUnitPrice(),
                        p.getAlertThreshold() != null ? BigDecimal.valueOf(p.getAlertThreshold()) : null)));

        fuelService.getAllFuels().forEach(f ->
                stock.add(new StockItemDTO(
                        "Carburant",
                        f.getIdItem() != null ? f.getIdItem().longValue() : null,
                        f.getName(),
                        f.getStock(),
                        f.getPricePerLiter(),
                        f.getAlertThreshold())));

        return ResponseEntity.ok(stock);
    }

    // ── Réapprovisionnements ──────────────────────────────────────────────────

    @GetMapping("/restocks")
    public ResponseEntity<List<RestockDTO>> getAllRestocks() {
        return ResponseEntity.ok(restockService.getAllRestocks());
    }

    @PostMapping("/restocks")
    public ResponseEntity<RestockDTO> createRestock(@RequestBody RestockDTO dto) {
        return ResponseEntity.ok(restockService.createRestock(dto));
    }

    @PutMapping("/restocks/{id}")
    public ResponseEntity<RestockDTO> updateRestock(@PathVariable Integer id, @RequestBody RestockDTO dto) {
        return ResponseEntity.ok(restockService.updateRestock(id, dto));
    }

    @DeleteMapping("/restocks/{id}")
    public ResponseEntity<Void> deleteRestock(@PathVariable Integer id) {
        restockService.deleteRestock(id);
        return ResponseEntity.noContent().build();
    }
}
