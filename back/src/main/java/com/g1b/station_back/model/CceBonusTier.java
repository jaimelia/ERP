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

    @Column(name = "bonus_amount", nullable = false, precision = 10, scale = 3)
    private BigDecimal bonusAmount;

    public CceBonusTier() {}
    public CceBonusTier(BigDecimal minAmount, BigDecimal bonusAmount) { this.minAmount = minAmount; this.bonusAmount = bonusAmount; }
    public Integer getIdTier() { return idTier; }
    public void setIdTier(Integer idTier) { this.idTier = idTier; }
    public BigDecimal getMinAmount() { return minAmount; }
    public void setMinAmount(BigDecimal minAmount) { this.minAmount = minAmount; }
    public BigDecimal getBonusAmount() { return bonusAmount; }
    public void setBonusAmount(BigDecimal bonusAmount) { this.bonusAmount = bonusAmount; }
}