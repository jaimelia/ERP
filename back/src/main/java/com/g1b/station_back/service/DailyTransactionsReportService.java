package com.g1b.station_back.service;

import com.g1b.station_back.dto.DailyReportRequestDTO;
import com.g1b.station_back.dto.DailyReportSummaryDTO;
import com.g1b.station_back.dto.DailyTransactionsReportDTO;
import com.g1b.station_back.dto.FuelReportLineDTO;
import com.g1b.station_back.model.*;
import com.g1b.station_back.model.enums.DocumentStatus;
import com.g1b.station_back.model.enums.TransactionStatus;
import com.g1b.station_back.repository.DailyTransactionsReportRepository;
import com.g1b.station_back.repository.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DailyTransactionsReportService {

    private final DailyTransactionsReportRepository reportRepository;
    private final TransactionRepository transactionRepository;

    public DailyTransactionsReportService(
            DailyTransactionsReportRepository reportRepository,
            TransactionRepository transactionRepository) {
        this.reportRepository = reportRepository;
        this.transactionRepository = transactionRepository;
    }

    // ─── Lecture ──────────────────────────────────────────────────────────────

    public List<DailyReportSummaryDTO> getAll() {
        return reportRepository.findAllByOrderByReportDateDesc()
                .stream().map(this::toSummaryDto).toList();
    }

    /** Calcule un aperçu depuis les transactions de la journée sans rien sauvegarder. */
    public DailyTransactionsReportDTO preview(LocalDate date) {
        return computeFromTransactions(null, date, null);
    }

    /** Retourne les valeurs stockées en base + le détail carburant calculé depuis les transactions. */
    public DailyTransactionsReportDTO getById(Integer id) {
        DailyTransactionsReport report = findById(id);
        List<FuelReportLineDTO> fuelLines = extractFuelLines(report.getReportDate());
        return toDetailDto(report, fuelLines);
    }

    // ─── Mutations ────────────────────────────────────────────────────────────

    public DailyTransactionsReportDTO create(DailyReportRequestDTO request) {
        LocalDate date = LocalDate.parse(request.reportDate());
        if (reportRepository.existsByReportDate(date)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Un rapport existe déjà pour la date " + date);
        }
        DailyTransactionsReport entity = new DailyTransactionsReport();
        entity.setReportDate(date);
        entity.setStatus(DocumentStatus.pending);
        applyRequestValues(entity, request);
        DailyTransactionsReport saved = reportRepository.save(entity);
        return toDetailDto(saved, extractFuelLines(date));
    }

    public DailyTransactionsReportDTO update(Integer id, DailyReportRequestDTO request) {
        DailyTransactionsReport report = findPendingById(id);
        applyRequestValues(report, request);
        DailyTransactionsReport saved = reportRepository.save(report);
        return toDetailDto(saved, extractFuelLines(saved.getReportDate()));
    }

    public DailyTransactionsReportDTO validate(Integer id) {
        DailyTransactionsReport report = findPendingById(id);
        report.setStatus(DocumentStatus.locked);
        DailyTransactionsReport saved = reportRepository.save(report);
        return toDetailDto(saved, extractFuelLines(saved.getReportDate()));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /** Calcule toutes les valeurs depuis les transactions acceptées de la date donnée. */
    private DailyTransactionsReportDTO computeFromTransactions(
            Integer reportId, LocalDate date, DocumentStatus status) {

        List<Transaction> transactions = transactionRepository
                .findByTransactionDateAndStatus(date, TransactionStatus.accepted);

        Map<String, BigDecimal> fuelVolumes = new LinkedHashMap<>();
        Map<String, BigDecimal> fuelAmounts = new LinkedHashMap<>();
        Map<String, BigDecimal> fuelPrices  = new LinkedHashMap<>();
        BigDecimal totalElectricityVolume   = BigDecimal.ZERO;
        BigDecimal totalElectricityAmount   = BigDecimal.ZERO;
        BigDecimal totalProductVolume       = BigDecimal.ZERO;
        BigDecimal totalProductsAmount      = BigDecimal.ZERO;
        int automatCount = 0;
        int cashierCount = 0;

        for (Transaction t : transactions) {
            if (Boolean.TRUE.equals(t.getIsFromAutomat())) automatCount++;
            else cashierCount++;

            for (TransactionLine line : t.getLines()) {
                Item item = line.getItem();
                BigDecimal qty = BigDecimal.valueOf(line.getQuantity());
                BigDecimal amt = line.getTotalAmount() != null ? line.getTotalAmount() : BigDecimal.ZERO;

                if (item instanceof Fuel fuel) {
                    fuelVolumes.merge(item.getName(), qty, BigDecimal::add);
                    fuelAmounts.merge(item.getName(), amt, BigDecimal::add);
                    fuelPrices.putIfAbsent(item.getName(), fuel.getPricePerLiter());
                } else if (item instanceof Electricity) {
                    totalElectricityVolume = totalElectricityVolume.add(qty);
                    totalElectricityAmount = totalElectricityAmount.add(amt);
                } else if (item instanceof Product) {
                    totalProductVolume = totalProductVolume.add(qty);
                    totalProductsAmount = totalProductsAmount.add(amt);
                }
            }
        }

        List<FuelReportLineDTO> fuelLines = fuelVolumes.entrySet().stream()
                .map(e -> new FuelReportLineDTO(
                        e.getKey(),
                        e.getValue().intValue(),
                        fuelPrices.get(e.getKey()),
                        fuelAmounts.get(e.getKey())
                )).toList();

        BigDecimal totalFuelVolume  = fuelVolumes.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalFuelsAmount = fuelAmounts.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalAmount      = totalFuelsAmount.add(totalElectricityAmount).add(totalProductsAmount);

        return new DailyTransactionsReportDTO(
                reportId, date, fuelLines,
                totalFuelVolume, totalElectricityVolume, totalElectricityAmount,
                totalProductVolume, totalProductsAmount,
                automatCount, cashierCount, automatCount + cashierCount,
                totalFuelsAmount, totalAmount, status
        );
    }

    /** Extrait uniquement le détail par carburant depuis les transactions (pour affichage en lecture seule). */
    private List<FuelReportLineDTO> extractFuelLines(LocalDate date) {
        List<Transaction> transactions = transactionRepository
                .findByTransactionDateAndStatus(date, TransactionStatus.accepted);

        Map<String, BigDecimal> fuelVolumes = new LinkedHashMap<>();
        Map<String, BigDecimal> fuelAmounts = new LinkedHashMap<>();
        Map<String, BigDecimal> fuelPrices  = new LinkedHashMap<>();

        for (Transaction t : transactions) {
            for (TransactionLine line : t.getLines()) {
                Item item = line.getItem();
                if (item instanceof Fuel fuel) {
                    BigDecimal qty = BigDecimal.valueOf(line.getQuantity());
                    BigDecimal amt = line.getTotalAmount() != null ? line.getTotalAmount() : BigDecimal.ZERO;
                    fuelVolumes.merge(item.getName(), qty, BigDecimal::add);
                    fuelAmounts.merge(item.getName(), amt, BigDecimal::add);
                    fuelPrices.putIfAbsent(item.getName(), fuel.getPricePerLiter());
                }
            }
        }

        return fuelVolumes.entrySet().stream()
                .map(e -> new FuelReportLineDTO(
                        e.getKey(),
                        e.getValue().intValue(),
                        fuelPrices.get(e.getKey()),
                        fuelAmounts.get(e.getKey())
                )).toList();
    }

    /** Construit le DTO détail depuis l'entité stockée + les lignes carburant calculées. */
    private DailyTransactionsReportDTO toDetailDto(DailyTransactionsReport entity, List<FuelReportLineDTO> fuelLines) {
        int cashierCount = entity.getTransactionCount() - entity.getAnnexTransactionCount();
        return new DailyTransactionsReportDTO(
                entity.getIdDailyTransactionReport(),
                entity.getReportDate(),
                fuelLines,
                entity.getTotalFuelVolume(),
                entity.getTotalElectricityVolume(),
                entity.getTotalElectricityAmount(),
                entity.getTotalProductVolume(),
                entity.getTotalProductsAmount(),
                entity.getAnnexTransactionCount(),
                cashierCount,
                entity.getTransactionCount(),
                entity.getTotalFuelsAmount(),
                entity.getTotalAmount(),
                entity.getStatus()
        );
    }

    private void applyRequestValues(DailyTransactionsReport entity, DailyReportRequestDTO request) {
        BigDecimal totalAmount = request.totalFuelsAmount()
                .add(request.totalElectricityAmount())
                .add(request.totalProductsAmount());

        entity.setTotalFuelVolume(request.totalFuelVolume());
        entity.setTotalFuelsAmount(request.totalFuelsAmount());
        entity.setTotalElectricityVolume(request.totalElectricityVolume());
        entity.setTotalElectricityAmount(request.totalElectricityAmount());
        entity.setTotalProductVolume(request.totalProductVolume());
        entity.setTotalProductsAmount(request.totalProductsAmount());
        entity.setTransactionCount(request.automatTransactionCount() + request.cashierTransactionCount());
        entity.setAnnexTransactionCount(request.automatTransactionCount());
        entity.setTotalAmount(totalAmount);
    }

    private DailyTransactionsReport findById(Integer id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Rapport introuvable : " + id));
    }

    private DailyTransactionsReport findPendingById(Integer id) {
        DailyTransactionsReport report = findById(id);
        if (report.getStatus() != DocumentStatus.pending) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Ce rapport ne peut plus être modifié.");
        }
        return report;
    }

    private DailyReportSummaryDTO toSummaryDto(DailyTransactionsReport report) {
        return new DailyReportSummaryDTO(
                report.getIdDailyTransactionReport(),
                report.getReportDate(),
                report.getTransactionCount(),
                report.getTotalAmount(),
                report.getStatus()
        );
    }
}
