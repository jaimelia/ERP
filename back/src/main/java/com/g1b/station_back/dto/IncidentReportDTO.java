package com.g1b.station_back.dto;

import com.g1b.station_back.model.enums.DocumentStatus;

import java.time.LocalDateTime;

public record IncidentReportDTO(
        Integer id,
        String type,
        LocalDateTime date,
        String technicalDetail,
        String resolution,
        DocumentStatus status
) {}
