package com.g1b.station_back.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "electricity")
public class Electricity extends Item {
    @Column(name = "fast_price", nullable = false, precision = 5, scale = 3)
    private BigDecimal fastPrice;

    @Column(name = "normal_price", nullable = false, precision = 5, scale = 3)
    private BigDecimal normalPrice;

    public Electricity() {}
    public Electricity(Integer idItem, String itemType, String name, BigDecimal fastPrice, BigDecimal normalPrice) {
        super(idItem, itemType, name);
        this.fastPrice = fastPrice; this.normalPrice = normalPrice;
    }

    public BigDecimal getFastPrice() { return fastPrice; }
    public void setFastPrice(BigDecimal fastPrice) { this.fastPrice = fastPrice; }
    public BigDecimal getNormalPrice() { return normalPrice; }
    public void setNormalPrice(BigDecimal normalPrice) { this.normalPrice = normalPrice; }
}
