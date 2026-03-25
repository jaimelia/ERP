package com.g1b.station_back.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cce_settings")
public class CceSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_setting")
    private Integer idSetting;

    @Column(name = "minimum_credit_amount", nullable = false, precision = 10, scale = 3)
    private BigDecimal minimumCreditAmount;

    public CceSetting() {}
    public Integer getIdSetting() { return idSetting; }
    public void setIdSetting(Integer idSetting) { this.idSetting = idSetting; }
    public BigDecimal getMinimumCreditAmount() { return minimumCreditAmount; }
    public void setMinimumCreditAmount(BigDecimal minimumCreditAmount) { this.minimumCreditAmount = minimumCreditAmount; }
}