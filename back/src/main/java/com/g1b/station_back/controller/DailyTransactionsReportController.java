package com.g1b.station_back.controller;

import com.g1b.station_back.dto.DailyReportSummaryDTO;
import com.g1b.station_back.dto.DailyTransactionsReportDTO;
import com.g1b.station_back.service.DailyTransactionsReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/daily-reports")
public class DailyTransactionsReportController {

    private final DailyTransactionsReportService service;

    public DailyTransactionsReportController(DailyTransactionsReportService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_DAILY_REPORTS')")
    public ResponseEntity<List<DailyReportSummaryDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/preview")
    @PreAuthorize("hasAuthority('MANAGE_DAILY_REPORTS')")
    public ResponseEntity<DailyTransactionsReportDTO> preview(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(service.preview(date));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_DAILY_REPORTS')")
    public ResponseEntity<DailyTransactionsReportDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_DAILY_REPORTS')")
    public ResponseEntity<DailyTransactionsReportDTO> create(@RequestBody Map<String, String> body) {
        LocalDate date = LocalDate.parse(body.get("reportDate"));
        return ResponseEntity.ok(service.create(date));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_DAILY_REPORTS')")
    public ResponseEntity<DailyTransactionsReportDTO> update(@PathVariable Integer id) {
        return ResponseEntity.ok(service.update(id));
    }

    @PatchMapping("/{id}/validate")
    @PreAuthorize("hasAuthority('MANAGE_DAILY_REPORTS')")
    public ResponseEntity<DailyTransactionsReportDTO> validate(@PathVariable Integer id) {
        return ResponseEntity.ok(service.validate(id));
    }
}
