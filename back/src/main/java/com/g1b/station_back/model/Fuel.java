package com.g1b.station_back.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "Fuels")
public class Fuel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idFuel")
    private Long idFuel;

    @Column(name = "name")
    private String name;

    @Column(name = "pricePerLiter")
    private BigDecimal pricePerLiter;

    @Column(name = "stock")
    private BigDecimal stock;

    @Column(name = "alertThreshold")
    private BigDecimal alertThreshold;

    public Fuel() {
    }

    public Long getIdFuel() {
        return idFuel;
    }

    public void setIdFuel(Long idFuel) {
        this.idFuel = idFuel;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPricePerLiter() {
        return pricePerLiter;
    }

    public void setPricePerLiter(BigDecimal pricePerLiter) {
        this.pricePerLiter = pricePerLiter;
    }

    public BigDecimal getStock() {
        return stock;
    }

    public void setStock(BigDecimal stock) {
        this.stock = stock;
    }

    public BigDecimal getAlertThreshold() {
        return alertThreshold;
    }

    public void setAlertThreshold(BigDecimal alertThreshold) {
        this.alertThreshold = alertThreshold;
    }
}