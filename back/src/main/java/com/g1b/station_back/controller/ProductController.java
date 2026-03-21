package com.g1b.station_back.controller;

import com.g1b.station_back.dto.ProductDTO;
import com.g1b.station_back.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // Import added for @RequestParam
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/available-names")
    public ResponseEntity<List<String>> getAvailableProductNames(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(productService.getAvailableProductNames(search));
    }
}
