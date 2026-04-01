package com.g1b.station_back.service;

import com.g1b.station_back.dto.IncidentReportDTO;
import com.g1b.station_back.model.IncidentReport;
import com.g1b.station_back.model.enums.DocumentStatus;
import com.g1b.station_back.repository.IncidentReportRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentReportService {

    private final IncidentReportRepository repository;

    public IncidentReportService(IncidentReportRepository repository) {
        this.repository = repository;
    }

    public List<IncidentReportDTO> getAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public IncidentReportDTO create(IncidentReportDTO dto) {
        IncidentReport report = new IncidentReport();
        report.setType(dto.type());
        report.setDate(dto.date());
        report.setTechnicalDetail(dto.technicalDetail());
        report.setResolution(dto.resolution());
        report.setStatus(DocumentStatus.pending);
        return toDto(repository.save(report));
    }

    public IncidentReportDTO update(Integer id, IncidentReportDTO dto) {
        IncidentReport report = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fiche incident introuvable : " + id));
        report.setType(dto.type());
        report.setDate(dto.date());
        report.setTechnicalDetail(dto.technicalDetail());
        report.setResolution(dto.resolution());
        return toDto(repository.save(report));
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Fiche incident introuvable : " + id);
        }
        repository.deleteById(id);
    }

    public IncidentReportDTO send(Integer id) {
        IncidentReport report = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fiche incident introuvable : " + id));
        report.setStatus(DocumentStatus.sentToDR);
        return toDto(repository.save(report));
    }

    private IncidentReportDTO toDto(IncidentReport r) {
        return new IncidentReportDTO(
                r.getIdIncidentReport(),
                r.getType(),
                r.getDate(),
                r.getTechnicalDetail(),
                r.getResolution(),
                r.getStatus()
        );
    }
}
