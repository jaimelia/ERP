package com.g1b.station_back.service;

import com.g1b.station_back.dto.StockItemDTO;
import com.g1b.station_back.repository.FuelRepository;
import com.g1b.station_back.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockService {

    private final ProductRepository productRepository;
    private final FuelRepository fuelRepository;

    public StockService(ProductRepository productRepository, FuelRepository fuelRepository) {
        this.productRepository = productRepository;
        this.fuelRepository = fuelRepository;
    }

    public List<StockItemDTO> getAllStocks() {
        List<StockItemDTO> allStocks = new ArrayList<>();

        List<StockItemDTO> products = productRepository.findAll().stream()
                .map(p -> new StockItemDTO(
                        "GOOD",
                        p.getIdProduct(),
                        p.getName(),
                        new BigDecimal(p.getStock() != null ? p.getStock() : 0),
                        p.getUnitPrice()
                ))
                .toList();

        List<StockItemDTO> fuels = fuelRepository.findAll().stream()
                .map(f -> new StockItemDTO(
                        "ENERGY",
                        f.getIdFuel(),
                        f.getName(),
                        f.getStock(),
                        f.getPricePerLiter()
                ))
                .toList();

        allStocks.addAll(products);
        allStocks.addAll(fuels);

        return allStocks;
    }
}