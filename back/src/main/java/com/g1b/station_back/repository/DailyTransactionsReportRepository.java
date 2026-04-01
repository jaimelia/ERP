package com.g1b.station_back.repository;

import com.g1b.station_back.model.DailyTransactionsReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyTransactionsReportRepository extends JpaRepository<DailyTransactionsReport, Integer> {

    List<DailyTransactionsReport> findAllByOrderByReportDateDesc();

    boolean existsByReportDate(LocalDate reportDate);
}
