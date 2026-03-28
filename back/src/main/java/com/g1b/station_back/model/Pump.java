package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.PumpChargerStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private Boolean enabled;

    @Column(name = "in_use_at")
    private LocalDateTime inUseAt;

    public Pump() {}
    public Pump(Integer idPump, Boolean isAutomat, PumpChargerStatus status, Boolean enabled, LocalDateTime inUseAt) {
        this.idPump = idPump; this.isAutomat = isAutomat; this.status = status; this.enabled = enabled; this.inUseAt = inUseAt;
    }

    public Integer getIdPump() { return idPump; }
    public void setIdPump(Integer idPump) { this.idPump = idPump; }
    public Boolean getIsAutomat() { return isAutomat; }
    public void setIsAutomat(Boolean isAutomat) { this.isAutomat = isAutomat; }
    public PumpChargerStatus getStatus() { return status; }
    public void setStatus(PumpChargerStatus status) { this.status = status; }
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    public LocalDateTime getInUseAt() { return inUseAt; }
    public void setInUseAt(LocalDateTime inUseAt) { this.inUseAt = inUseAt; }
}
