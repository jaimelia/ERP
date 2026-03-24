package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.DocumentStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "daily_transactions_reports")
public class DailyTransactionsReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_daily_transaction_report")
    private Integer idDailyTransactionReport;

    @Column(name = "total_fuel_volume", nullable = false)
    private BigDecimal totalFuelVolume;

    @Column(name = "total_electricity_volume", nullable = false)
    private BigDecimal totalElectricityVolume;

    @Column(name = "total_product_volume", nullable = false)
    private BigDecimal totalProductVolume;

    @Column(name = "transaction_count", nullable = false)
    private Integer transactionCount;

    @Column(name = "annex_transaction_count", nullable = false)
    private Integer annexTransactionCount;

    @Column(name = "total_fuels_amount", nullable = false)
    private BigDecimal totalFuelsAmount;

    @Column(name = "total_electricity_amount", nullable = false)
    private BigDecimal totalElectricityAmount;

    @Column(name = "total_products_amount", nullable = false)
    private BigDecimal totalProductsAmount;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DocumentStatus status;

    public DailyTransactionsReport() {}
    public DailyTransactionsReport(Integer idDailyTransactionReport, BigDecimal totalFuelVolume, BigDecimal totalElectricityVolume, BigDecimal totalProductVolume, Integer transactionCount, Integer annexTransactionCount, BigDecimal totalFuelsAmount, BigDecimal totalElectricityAmount, BigDecimal totalProductsAmount, LocalDate reportDate, BigDecimal totalAmount, DocumentStatus status) {
        this.idDailyTransactionReport = idDailyTransactionReport; this.totalFuelVolume = totalFuelVolume; this.totalElectricityVolume = totalElectricityVolume; this.totalProductVolume = totalProductVolume; this.transactionCount = transactionCount; this.annexTransactionCount = annexTransactionCount; this.totalFuelsAmount = totalFuelsAmount; this.totalElectricityAmount = totalElectricityAmount; this.totalProductsAmount = totalProductsAmount; this.reportDate = reportDate; this.totalAmount = totalAmount; this.status = status;
    }

    public Integer getIdDailyTransactionReport() { return idDailyTransactionReport; }
    public void setIdDailyTransactionReport(Integer idDailyTransactionReport) { this.idDailyTransactionReport = idDailyTransactionReport; }
    public BigDecimal getTotalFuelVolume() { return totalFuelVolume; }
    public void setTotalFuelVolume(BigDecimal totalFuelVolume) { this.totalFuelVolume = totalFuelVolume; }
    public BigDecimal getTotalElectricityVolume() { return totalElectricityVolume; }
    public void setTotalElectricityVolume(BigDecimal totalElectricityVolume) { this.totalElectricityVolume = totalElectricityVolume; }
    public BigDecimal getTotalProductVolume() { return totalProductVolume; }
    public void setTotalProductVolume(BigDecimal totalProductVolume) { this.totalProductVolume = totalProductVolume; }
    public Integer getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Integer transactionCount) { this.transactionCount = transactionCount; }
    public Integer getAnnexTransactionCount() { return annexTransactionCount; }
    public void setAnnexTransactionCount(Integer annexTransactionCount) { this.annexTransactionCount = annexTransactionCount; }
    public BigDecimal getTotalFuelsAmount() { return totalFuelsAmount; }
    public void setTotalFuelsAmount(BigDecimal totalFuelsAmount) { this.totalFuelsAmount = totalFuelsAmount; }
    public BigDecimal getTotalElectricityAmount() { return totalElectricityAmount; }
    public void setTotalElectricityAmount(BigDecimal totalElectricityAmount) { this.totalElectricityAmount = totalElectricityAmount; }
    public BigDecimal getTotalProductsAmount() { return totalProductsAmount; }
    public void setTotalProductsAmount(BigDecimal totalProductsAmount) { this.totalProductsAmount = totalProductsAmount; }
    public LocalDate getReportDate() { return reportDate; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public DocumentStatus getStatus() { return status; }
    public void setStatus(DocumentStatus status) { this.status = status; }
}
