package com.g1b.station_back.dto;

import java.math.BigDecimal;

public class ProductDTO {
    private Integer idItem;
    private String name;
    private BigDecimal unitPrice;
    private Integer stock;
    private Integer alertThreshold;

    public ProductDTO() {}

    public ProductDTO(Integer idItem, String name, BigDecimal unitPrice, Integer stock, Integer alertThreshold) {
        this.idItem = idItem;
        this.name = name;
        this.unitPrice = unitPrice;
        this.stock = stock;
        this.alertThreshold = alertThreshold;
    }

    public Integer getIdItem() { return idItem; }
    public void setIdItem(Integer idItem) { this.idItem = idItem; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Integer getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(Integer alertThreshold) { this.alertThreshold = alertThreshold; }
}
