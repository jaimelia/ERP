package com.g1b.station_back.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "fuels")
public class Fuel extends Item {
    @Column(name = "price_per_liter", nullable = false, precision = 5, scale = 3)
    private BigDecimal pricePerLiter;

    @Column(precision = 5, scale = 3)
    private BigDecimal stock;

    @Column(name = "alert_threshold", nullable = false, precision = 5, scale = 3)
    private BigDecimal alertThreshold;

    public Fuel() {}
    public Fuel(Integer idItem, String name, BigDecimal pricePerLiter, BigDecimal stock, BigDecimal alertThreshold) {
        super(idItem, name);
        this.pricePerLiter = pricePerLiter; this.stock = stock; this.alertThreshold = alertThreshold;
    }

    public BigDecimal getPricePerLiter() { return pricePerLiter; }
    public void setPricePerLiter(BigDecimal pricePerLiter) { this.pricePerLiter = pricePerLiter; }
    public BigDecimal getStock() { return stock; }
    public void setStock(BigDecimal stock) { this.stock = stock; }
    public BigDecimal getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(BigDecimal alertThreshold) { this.alertThreshold = alertThreshold; }
}