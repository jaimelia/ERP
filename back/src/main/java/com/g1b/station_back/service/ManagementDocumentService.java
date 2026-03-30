package com.g1b.station_back.service;

import com.g1b.station_back.dto.ManagementDocumentDTO;
import com.g1b.station_back.model.ManagementDocument;
import com.g1b.station_back.model.enums.DocumentStatus;
import com.g1b.station_back.repository.ManagementDocumentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ManagementDocumentService {

    private static final long AUTO_LOCK_DELAY_SECONDS = 30;

    private final ManagementDocumentRepository repository;

    public ManagementDocumentService(ManagementDocumentRepository repository) {
        this.repository = repository;
    }

    // ── Lecture ───────────────────────────────────────────────────────────────

    public List<ManagementDocumentDTO> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    // ── Création texte ────────────────────────────────────────────────────────

    public ManagementDocumentDTO create(String name, String content) {
        ManagementDocument doc = new ManagementDocument();
        doc.setName(name);
        doc.setContent(content);
        doc.setLastModified(LocalDateTime.now());
        doc.setStatus(DocumentStatus.pending);
        return toDto(repository.save(doc));
    }

    // ── Import PDF ────────────────────────────────────────────────────────────

    public ManagementDocumentDTO importPdf(MultipartFile file) throws IOException {
        String extractedText = extractTextFromPdf(file);
        String name = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf";

        ManagementDocument doc = new ManagementDocument();
        doc.setName(name);
        doc.setContent(extractedText);
        doc.setLastModified(LocalDateTime.now());
        doc.setStatus(DocumentStatus.pending);
        return toDto(repository.save(doc));
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument pdf = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(pdf);
        }
    }

    // ── Mise à jour ───────────────────────────────────────────────────────────

    public ManagementDocumentDTO update(Integer id, String name, String content) {
        ManagementDocument doc = findPendingById(id);
        doc.setName(name);
        doc.setContent(content);
        doc.setLastModified(LocalDateTime.now());
        return toDto(repository.save(doc));
    }

    // ── Envoi à la DR ─────────────────────────────────────────────────────────

    public ManagementDocumentDTO send(Integer id) {
        ManagementDocument doc = findPendingById(id);
        doc.setStatus(DocumentStatus.sentToDR);
        doc.setSentAt(LocalDateTime.now());
        return toDto(repository.save(doc));
    }

    // ── Suppression ───────────────────────────────────────────────────────────

    public void delete(Integer id) {
        ManagementDocument doc = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document introuvable : " + id));
        if (doc.getStatus() != DocumentStatus.pending) {
            throw new IllegalStateException("Seuls les documents en attente peuvent être supprimés.");
        }
        repository.deleteById(id);
    }

    // ── Scheduler : verrouillage automatique après 30 s ──────────────────────

    @Scheduled(fixedDelay = 10_000)
    public void autoLockSentDocuments() {
        LocalDateTime threshold = LocalDateTime.now().minusSeconds(AUTO_LOCK_DELAY_SECONDS);
        List<ManagementDocument> tolock =
                repository.findAllByStatusAndSentAtBefore(DocumentStatus.sentToDR, threshold);
        tolock.forEach(doc -> {
            doc.setStatus(DocumentStatus.locked);
            repository.save(doc);
        });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private ManagementDocument findPendingById(Integer id) {
        ManagementDocument doc = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document introuvable : " + id));
        if (doc.getStatus() != DocumentStatus.pending) {
            throw new IllegalStateException("Ce document ne peut plus être modifié.");
        }
        return doc;
    }

    private ManagementDocumentDTO toDto(ManagementDocument doc) {
        return new ManagementDocumentDTO(
                doc.getIdManagementDocument(),
                doc.getName(),
                doc.getLastModified(),
                doc.getContent(),
                doc.getStatus()
        );
    }
}
