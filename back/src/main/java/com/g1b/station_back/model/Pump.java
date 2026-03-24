package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.PumpChargerStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "pumps")
public class Pump {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pump")
    private Integer idPump;

    @Column(name = "is_automat", nullable = false)
    private Boolean isAutomat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PumpChargerStatus status;

    public Pump() {}
    public Pump(Integer idPump, Boolean isAutomat, PumpChargerStatus status) {
        this.idPump = idPump; this.isAutomat = isAutomat; this.status = status;
    }

    public Integer getIdPump() { return idPump; }
    public void setIdPump(Integer idPump) { this.idPump = idPump; }
    public Boolean getIsAutomat() { return isAutomat; }
    public void setIsAutomat(Boolean isAutomat) { this.isAutomat = isAutomat; }
    public PumpChargerStatus getStatus() { return status; }
    public void setStatus(PumpChargerStatus status) { this.status = status; }
}
