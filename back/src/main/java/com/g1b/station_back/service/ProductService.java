package com.g1b.station_back.service;

import com.g1b.station_back.dto.ProductDTO;
import com.g1b.station_back.model.Product;
import com.g1b.station_back.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
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

    public ProductDTO createProduct(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.name());
        product.setUnitPrice(dto.unitPrice());
        product.setStock(dto.stock());
        product.setAlertThreshold(dto.alertThreshold());
        Product saved = productRepository.save(product);
        return new ProductDTO(saved.getIdItem(), saved.getName(), saved.getUnitPrice(), saved.getStock(), saved.getAlertThreshold());
    }

    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produit introuvable : " + id));
        product.setName(dto.name());
        product.setUnitPrice(dto.unitPrice());
        product.setStock(dto.stock());
        product.setAlertThreshold(dto.alertThreshold());
        Product saved = productRepository.save(product);
        return new ProductDTO(saved.getIdItem(), saved.getName(), saved.getUnitPrice(), saved.getStock(), saved.getAlertThreshold());
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Produit introuvable : " + id);
        }
        productRepository.deleteById(id);
    }
}
