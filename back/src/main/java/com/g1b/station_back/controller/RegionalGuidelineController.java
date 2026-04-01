package com.g1b.station_back.controller;

import com.g1b.station_back.dto.RegionalGuidelineDTO;
import com.g1b.station_back.service.RegionalGuidelineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/guidelines")
public class RegionalGuidelineController {

    private final RegionalGuidelineService service;

    public RegionalGuidelineController(RegionalGuidelineService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<RegionalGuidelineDTO>> getAllGuidelines() {
        return ResponseEntity.ok(service.getAllGuidelines());
    }
}
