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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PumpChargerStatus status;

    public EvCharger() {}
    public EvCharger(Integer idEvCharger, Boolean isFast, BigDecimal energyAvailable, BigDecimal alertThreshold, PumpChargerStatus status) {
        this.idEvCharger = idEvCharger; this.isFast = isFast; this.status = status;
    }

    public Integer getIdEvCharger() { return idEvCharger; }
    public void setIdEvCharger(Integer idEvCharger) { this.idEvCharger = idEvCharger; }
    public Boolean getIsFast() { return isFast; }
    public void setIsFast(Boolean isFast) { this.isFast = isFast; }
    public PumpChargerStatus getStatus() { return status; }
    public void setStatus(PumpChargerStatus status) { this.status = status; }
}
