package com.g1b.station_back.repository;

import com.g1b.station_back.model.TransactionPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionPaymentRepository extends JpaRepository<TransactionPayment, Integer> {
    List<TransactionPayment> findByCceCard_IdCceCard(Integer idCceCard);
}