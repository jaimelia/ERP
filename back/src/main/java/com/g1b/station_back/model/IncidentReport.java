package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.DocumentStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incident_reports")
public class IncidentReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_incident_report")
    private Integer idIncidentReport;

    @Column(name = "type")
    private String type;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "technical_detail")
    private String technicalDetail;

    @Column(name = "resolution")
    private String resolution;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status;

    public IncidentReport() {}
    public IncidentReport(Integer idIncidentReport, String type, LocalDateTime date, String technicalDetail, String resolution, DocumentStatus status) {
        this.idIncidentReport = idIncidentReport; this.type = type; this.date = date; this.technicalDetail = technicalDetail; this.resolution = resolution; this.status = status;
    }

    public Integer getIdIncidentReport() { return idIncidentReport; }
    public void setIdIncidentReport(Integer idIncidentReport) { this.idIncidentReport = idIncidentReport; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public String getTechnicalDetail() { return technicalDetail; }
    public void setTechnicalDetail(String technicalDetail) { this.technicalDetail = technicalDetail; }
    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }
    public DocumentStatus getStatus() { return status; }
    public void setStatus(DocumentStatus status) { this.status = status; }
}