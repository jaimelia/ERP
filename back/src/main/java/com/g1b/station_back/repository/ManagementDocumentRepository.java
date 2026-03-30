package com.g1b.station_back.repository;

import com.g1b.station_back.model.ManagementDocument;
import com.g1b.station_back.model.enums.DocumentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ManagementDocumentRepository extends JpaRepository<ManagementDocument, Integer> {
    List<ManagementDocument> findAllByStatusAndSentAtBefore(DocumentStatus status, LocalDateTime threshold);
}
