package com.g1b.station_back.repository;

import com.g1b.station_back.model.Fuel;
import com.g1b.station_back.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	Product findByIdItem(Integer idItem);
}
