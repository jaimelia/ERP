package com.g1b.station_back.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cce_bonus_tiers")
public class CceBonusTier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tier")
    private Integer idTier;

    @Column(name = "min_amount", nullable = false, precision = 10, scale = 3)
    private BigDecimal minAmount;

    @Column(name = "bonus", nullable = false, precision = 5, scale = 2)
    private BigDecimal bonus;

    public CceBonusTier() {}
    public CceBonusTier(BigDecimal minAmount, BigDecimal bonusPercentage) { this.minAmount = minAmount; this.bonus = bonusPercentage; }
    public Integer getIdTier() { return idTier; }
    public void setIdTier(Integer idTier) { this.idTier = idTier; }
    public BigDecimal getMinAmount() { return minAmount; }
    public void setMinAmount(BigDecimal minAmount) { this.minAmount = minAmount; }
    public BigDecimal getBonusPercentage() { return bonus; }
    public void setBonusPercentage(BigDecimal bonusPercentage) { this.bonus = bonusPercentage; }
}