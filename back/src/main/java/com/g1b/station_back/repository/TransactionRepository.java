package com.g1b.station_back.repository;

import com.g1b.station_back.model.Transaction;
import com.g1b.station_back.model.TransactionLine;
import com.g1b.station_back.model.TransactionPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {}

