package com.g1b.station_back.repository;

import com.g1b.station_back.model.ItemPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemPriceRepository extends JpaRepository<ItemPrice, Integer> {
}
