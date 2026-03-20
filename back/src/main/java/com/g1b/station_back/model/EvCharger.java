package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.PumpChargerStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ev_chargers")
public class EvCharger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ev_charger")
    private Integer idEvCharger;

    @Column(name = "is_fast", nullable = false)
    private Boolean isFast;

    @Column(name = "energy_available", nullable = false, precision = 5, scale = 3)
    private BigDecimal energyAvailable;

    @Column(name = "alert_threshold", precision = 5, scale = 3)
    private BigDecimal alertThreshold;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PumpChargerStatus status;

    public EvCharger() {}
    public EvCharger(Integer idEvCharger, Boolean isFast, BigDecimal energyAvailable, BigDecimal alertThreshold, PumpChargerStatus status) {
        this.idEvCharger = idEvCharger; this.isFast = isFast; this.energyAvailable = energyAvailable; this.alertThreshold = alertThreshold; this.status = status;
    }

    public Integer getIdEvCharger() { return idEvCharger; }
    public void setIdEvCharger(Integer idEvCharger) { this.idEvCharger = idEvCharger; }
    public Boolean getIsFast() { return isFast; }
    public void setIsFast(Boolean isFast) { this.isFast = isFast; }
    public BigDecimal getEnergyAvailable() { return energyAvailable; }
    public void setEnergyAvailable(BigDecimal energyAvailable) { this.energyAvailable = energyAvailable; }
    public BigDecimal getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(BigDecimal alertThreshold) { this.alertThreshold = alertThreshold; }
    public PumpChargerStatus getStatus() { return status; }
    public void setStatus(PumpChargerStatus status) { this.status = status; }
}
