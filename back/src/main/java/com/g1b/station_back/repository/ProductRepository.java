package com.g1b.station_back.repository;

import com.g1b.station_back.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	Product findByIdItem(Integer idItem);
    List<Product> findByStockGreaterThanAndNameContainingIgnoreCase(Integer stock, String name);
    List<Product> findByStockGreaterThan(Integer stock);
}
