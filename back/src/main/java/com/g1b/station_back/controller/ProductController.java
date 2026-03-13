package com.g1b.station_back.controller;

import com.g1b.station_back.dto.StockItemDTO;
import com.g1b.station_back.service.StockService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final StockService stockService;

    public ProductController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/{productId}")
    public Long getProduct(@PathVariable Long productId) {
        return productId;
    }

    @GetMapping("/all")
    public List<StockItemDTO> getAllProducts() {
        return stockService.getAllStocks();
    }

    @GetMapping("/ping")
    public String pong() {
        return "I'm alive !";
    }
}