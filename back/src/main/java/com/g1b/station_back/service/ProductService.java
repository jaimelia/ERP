package com.g1b.station_back.service;

import com.g1b.station_back.dto.ProductDTO;
import com.g1b.station_back.repository.ProductRepository;
import com.g1b.station_back.model.Product;
import org.springframework.stereotype.Service;

import org.springframework.util.StringUtils;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {this.productRepository = productRepository;}

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(p -> new ProductDTO(p.getIdItem(), p.getName(), p.getUnitPrice(), p.getStock(), p.getAlertThreshold()))
                .toList();
    }

    public List<String> getAvailableProductNames(String searchTerm) {
        List<Product> products = StringUtils.hasText(searchTerm) ?
                productRepository.findByStockGreaterThanAndNameContainingIgnoreCase(0, searchTerm) :
                productRepository.findByStockGreaterThan(0);
        return products.stream().map(Product::getName).toList();
    }
}
