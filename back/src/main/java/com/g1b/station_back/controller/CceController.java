package com.g1b.station_back.controller;

import com.g1b.station_back.dto.*;
import com.g1b.station_back.service.CceCardService;
import com.g1b.station_back.service.CceSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cce")
public class CceController {

    private final CceCardService cceCardService;
    private final CceSettingsService cceSettingsService;

    public CceController(CceCardService cceCardService, CceSettingsService cceSettingsService) {
        this.cceCardService = cceCardService;
        this.cceSettingsService = cceSettingsService;
    }

    @GetMapping
    public ResponseEntity<List<CceDTO>> getAllCce() {
        return ResponseEntity.ok(cceCardService.getAllCceCards());
    }

    @PostMapping
    public ResponseEntity<Void> createCce(@RequestBody CceCreateDTO request) {
        cceCardService.createCce(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> editCce(@PathVariable Integer id, @RequestBody CceEditDTO request) {
        cceCardService.editCce(id, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/credit")
    public ResponseEntity<Void> creditCce(@PathVariable Integer id, @RequestBody CceCreditDTO request) {
        cceCardService.creditCce(id, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reedit")
    public ResponseEntity<Void> reeditCce(@PathVariable Integer id, @RequestBody CceCreateDTO request) {
        cceCardService.reeditCce(id, request);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleStatus(@PathVariable Integer id) {
        cceCardService.toggleStatus(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<CceTransactionDTO>> getCceTransactions(@PathVariable Integer id) {
        return ResponseEntity.ok(cceCardService.getCceTransactions(id));
    }

    @GetMapping("/settings")
    public ResponseEntity<CceSettingsDTO> getSettings() {
        return ResponseEntity.ok(cceSettingsService.getGlobalSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<Void> updateSettings(@RequestBody CceSettingsDTO request) {
        cceSettingsService.updateGlobalSettings(request);
        return ResponseEntity.ok().build();
    }
}