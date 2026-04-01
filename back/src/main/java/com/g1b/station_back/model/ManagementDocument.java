package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.DocumentStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "management_documents")
public class ManagementDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_management_document")
    private Integer idManagementDocument;

    @Column(nullable = false)
    private String name;

    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    public ManagementDocument() {}

    public Integer getIdManagementDocument() { return idManagementDocument; }
    public void setIdManagementDocument(Integer idManagementDocument) { this.idManagementDocument = idManagementDocument; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getLastModified() { return lastModified; }
    public void setLastModified(LocalDateTime lastModified) { this.lastModified = lastModified; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public DocumentStatus getStatus() { return status; }
    public void setStatus(DocumentStatus status) { this.status = status; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
