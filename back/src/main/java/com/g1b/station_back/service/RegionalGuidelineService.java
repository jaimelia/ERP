package com.g1b.station_back.service;

import com.g1b.station_back.dto.RegionalGuidelineDTO;
import com.g1b.station_back.repository.RegionalGuidelineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegionalGuidelineService {

    private final RegionalGuidelineRepository repository;

    public RegionalGuidelineService(RegionalGuidelineRepository repository) {
        this.repository = repository;
    }

    public List<RegionalGuidelineDTO> getAllGuidelines() {
        return repository.findAll()
                .stream()
                .map(g -> new RegionalGuidelineDTO(
                        g.getIdRegionalGuideline(),
                        g.getObject(),
                        g.getContent()))
                .toList();
    }
}
