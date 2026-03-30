package com.g1b.station_back.controller;

import com.g1b.station_back.dto.ManagementDocumentDTO;
import com.g1b.station_back.service.ManagementDocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/management-documents")
public class ManagementDocumentController {

    private final ManagementDocumentService service;

    public ManagementDocumentController(ManagementDocumentService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_MANAGEMENT_DOCUMENTS')")
    public ResponseEntity<List<ManagementDocumentDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_MANAGEMENT_DOCUMENTS')")
    public ResponseEntity<ManagementDocumentDTO> create(@RequestBody Map<String, String> body) {
        String name    = body.getOrDefault("name", "Nouveau document");
        String content = body.getOrDefault("content", "");
        return ResponseEntity.ok(service.create(name, content));
    }

    @PostMapping("/import")
    @PreAuthorize("hasAuthority('MANAGE_MANAGEMENT_DOCUMENTS')")
    public ResponseEntity<ManagementDocumentDTO> importPdf(@RequestParam("file") MultipartFile file)
            throws IOException {
        return ResponseEntity.ok(service.importPdf(file));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_MANAGEMENT_DOCUMENTS')")
    public ResponseEntity<ManagementDocumentDTO> update(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        String name    = body.getOrDefault("name", "");
        String content = body.getOrDefault("content", "");
        return ResponseEntity.ok(service.update(id, name, content));
    }

    @PatchMapping("/{id}/send")
    @PreAuthorize("hasAuthority('MANAGE_MANAGEMENT_DOCUMENTS')")
    public ResponseEntity<ManagementDocumentDTO> send(@PathVariable Integer id) {
        return ResponseEntity.ok(service.send(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_MANAGEMENT_DOCUMENTS')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
