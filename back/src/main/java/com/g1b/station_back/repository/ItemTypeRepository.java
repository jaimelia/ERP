package com.g1b.station_back.repository;

import com.g1b.station_back.model.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemTypeRepository extends JpaRepository<ItemType, Integer> {
    Optional<ItemType> findByName(String name);
}
