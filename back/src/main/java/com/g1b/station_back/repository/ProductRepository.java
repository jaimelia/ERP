package com.g1b.station_back.repository;

import com.g1b.station_back.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Trouve les produits dont le stock est supérieur à une valeur et dont le nom contient le terme de recherche (insensible à la casse)
    List<Product> findByStockGreaterThanAndNameContainingIgnoreCase(Integer stock, String name);
    // Trouve les produits dont le stock est supérieur à une valeur
    List<Product> findByStockGreaterThan(Integer stock);
}