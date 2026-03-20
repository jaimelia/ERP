package com.g1b.station_back.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "pumps_fuels")
public class PumpFuel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pump_fuel")
    private Integer idPumpFuel;

    @ManyToOne
    @JoinColumn(name = "id_fuel", nullable = false)
    private Fuel fuel;

    @ManyToOne
    @JoinColumn(name = "id_pump", nullable = false)
    private Pump pump;

    @Column(name = "max_volume", precision = 5, scale = 3)
    private BigDecimal maxVolume;

    @Column(name = "available_volume", precision = 5, scale = 3)
    private BigDecimal availableVolume;

    public PumpFuel() {}
    public PumpFuel(Integer idPumpFuel, Fuel fuel, Pump pump, BigDecimal maxVolume, BigDecimal availableVolume) {
        this.idPumpFuel = idPumpFuel; this.fuel = fuel; this.pump = pump; this.maxVolume = maxVolume; this.availableVolume = availableVolume;
    }

    public Integer getIdPumpFuel() { return idPumpFuel; }
    public void setIdPumpFuel(Integer idPumpFuel) { this.idPumpFuel = idPumpFuel; }
    public Fuel getFuel() { return fuel; }
    public void setFuel(Fuel fuel) { this.fuel = fuel; }
    public Pump getPump() { return pump; }
    public void setPump(Pump pump) { this.pump = pump; }
    public BigDecimal getMaxVolume() { return maxVolume; }
    public void setMaxVolume(BigDecimal maxVolume) { this.maxVolume = maxVolume; }
    public BigDecimal getAvailableVolume() { return availableVolume; }
    public void setAvailableVolume(BigDecimal availableVolume) { this.availableVolume = availableVolume; }
}
