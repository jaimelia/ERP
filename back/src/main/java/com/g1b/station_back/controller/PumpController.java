package com.g1b.station_back.controller;

import com.g1b.station_back.dto.PumpDTO;
import com.g1b.station_back.dto.PumpEnabledDTO;
import com.g1b.station_back.dto.PumpChargerStatusUpdateDTO;
import com.g1b.station_back.service.PumpService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pumps")
public class PumpController {

    private final PumpService service;

    public PumpController(PumpService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PumpDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PatchMapping("/{id}/enabled")
	@PreAuthorize("hasAuthority('UPDATE_PUMPS')")
    public ResponseEntity<PumpDTO> toggleEnabled(
            @PathVariable Integer id,
            @RequestBody PumpEnabledDTO dto
    ) {
        return ResponseEntity.ok(service.toggleEnabled(id, dto.enabled()));
    }

	// TODO supprimer si on l'utilise pas dans le front
    @PatchMapping("/{id}/status")
	@PreAuthorize("hasAuthority('UPDATE_PUMPS')")
    public ResponseEntity<PumpDTO> updateStatus(
            @PathVariable Integer id,
            @RequestBody PumpChargerStatusUpdateDTO dto
    ) {
        return ResponseEntity.ok(service.updateStatus(id, dto.status()));
    }
}
