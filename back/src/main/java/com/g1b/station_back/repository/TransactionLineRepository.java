package com.g1b.station_back.repository;

import com.g1b.station_back.model.TransactionLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionLineRepository extends JpaRepository<TransactionLine, Integer> {}
