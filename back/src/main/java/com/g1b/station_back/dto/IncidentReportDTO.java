package com.g1b.station_back.dto;

import com.g1b.station_back.model.enums.DocumentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record IncidentReportDTO(
        Integer id,
        String type,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime date,
        String technicalDetail,
        String resolution,
        DocumentStatus status
) {}
