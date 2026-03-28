package com.g1b.station_back.dto;
import java.math.BigDecimal;
import java.util.List;

public record CceSettingsDTO(BigDecimal minimumCreditAmount, List<BonusTierDTO> bonusTiers) {
    public record BonusTierDTO(Integer id, BigDecimal minAmount, BigDecimal bonusAmount) {}
}