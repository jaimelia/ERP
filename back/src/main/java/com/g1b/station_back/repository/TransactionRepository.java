package com.g1b.station_back.repository;

import com.g1b.station_back.model.Transaction;
import com.g1b.station_back.model.enums.TransactionStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    @EntityGraph(attributePaths = {"lines", "lines.item", "payments"})
    List<Transaction> findAllByOrderByTransactionDateDesc();

    @EntityGraph(attributePaths = {"lines", "lines.item"})
    List<Transaction> findByTransactionDateAndStatus(LocalDate transactionDate, TransactionStatus status);
}
