package com.g1b.station_back.service;

import com.g1b.station_back.dto.ProductDTO;
import com.g1b.station_back.model.Product;
import com.g1b.station_back.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(p -> new ProductDTO(p.getIdItem(), p.getName(), p.getUnitPrice(), p.getStock(), p.getAlertThreshold()))
                .toList();
    }

    public ProductDTO createProduct(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setItemType("produit");
        product.setUnitPrice(dto.getUnitPrice());
        product.setStock(dto.getStock());
        product.setAlertThreshold(dto.getAlertThreshold());
        Product saved = productRepository.save(product);
        return new ProductDTO(saved.getIdItem(), saved.getName(), saved.getUnitPrice(), saved.getStock(), saved.getAlertThreshold());
    }

    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produit introuvable : " + id));
        product.setName(dto.getName());
        product.setUnitPrice(dto.getUnitPrice());
        product.setStock(dto.getStock());
        product.setAlertThreshold(dto.getAlertThreshold());
        Product saved = productRepository.save(product);
        return new ProductDTO(saved.getIdItem(), saved.getName(), saved.getUnitPrice(), saved.getStock(), saved.getAlertThreshold());
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Produit introuvable : " + id);
        }
        productRepository.deleteById(id);
    }
}
