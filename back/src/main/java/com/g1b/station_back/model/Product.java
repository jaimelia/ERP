package com.g1b.station_back.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product extends Item {
    @Column(name = "unit_price", nullable = false, precision = 5, scale = 3)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "alert_threshold", nullable = false)
    private Integer alertThreshold;

    public Product() {}
    public Product(Integer idItem, String itemType, String name, BigDecimal unitPrice, Integer stock, Integer alertThreshold) {
        super(idItem, itemType, name);
        this.unitPrice = unitPrice; this.stock = stock; this.alertThreshold = alertThreshold;
    }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Integer getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(Integer alertThreshold) { this.alertThreshold = alertThreshold; }
}
