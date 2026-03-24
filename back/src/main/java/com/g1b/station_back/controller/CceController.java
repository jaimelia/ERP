package com.g1b.station_back.controller;

import com.g1b.station_back.dto.CceDTO;
import com.g1b.station_back.service.CceCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cce")
public class CceController {

    private final CceCardService cceCardService;

    public CceController(CceCardService cceCardService) {
        this.cceCardService = cceCardService;
    }

    @GetMapping
    public ResponseEntity<List<CceDTO>> getAllCce() {
        return ResponseEntity.ok(cceCardService.getAllCceCards());
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleStatus(@PathVariable Integer id) {
        cceCardService.toggleStatus(id);
        return ResponseEntity.ok().build();
    }
}