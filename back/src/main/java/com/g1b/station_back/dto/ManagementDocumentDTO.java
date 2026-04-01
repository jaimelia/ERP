package com.g1b.station_back.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.g1b.station_back.model.enums.DocumentStatus;

import java.time.LocalDateTime;

public record ManagementDocumentDTO(
        Integer id,
        String name,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime lastModified,
        String content,
        DocumentStatus status
) {}
