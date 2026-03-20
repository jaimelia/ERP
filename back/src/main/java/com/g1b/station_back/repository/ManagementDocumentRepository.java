package com.g1b.station_back.repository;

import com.g1b.station_back.model.ManagementDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManagementDocumentRepository extends JpaRepository<ManagementDocument, Integer> {}
