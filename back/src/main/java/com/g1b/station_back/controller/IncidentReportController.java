package com.g1b.station_back.controller;

import com.g1b.station_back.dto.IncidentReportDTO;
import com.g1b.station_back.service.IncidentReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentReportController {

    private final IncidentReportService service;

    public IncidentReportController(IncidentReportService service) {
        this.service = service;
    }

    @GetMapping
	@PreAuthorize("hasAuthority('MANAGE_INCIDENT_REPORT')")
    public ResponseEntity<List<IncidentReportDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
	@PreAuthorize("hasAuthority('MANAGE_INCIDENT_REPORT')")
    public ResponseEntity<IncidentReportDTO> create(@RequestBody IncidentReportDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
	@PreAuthorize("hasAuthority('MANAGE_INCIDENT_REPORT')")
    public ResponseEntity<IncidentReportDTO> update(@PathVariable Integer id, @RequestBody IncidentReportDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
	@PreAuthorize("hasAuthority('MANAGE_INCIDENT_REPORT')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/send")
	@PreAuthorize("hasAuthority('MANAGE_INCIDENT_REPORT')")
    public ResponseEntity<IncidentReportDTO> send(@PathVariable Integer id) {
        return ResponseEntity.ok(service.send(id));
    }
}
