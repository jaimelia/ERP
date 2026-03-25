package com.g1b.station_back.dto;

import java.math.BigDecimal;

public class FuelDTO {
    private Integer idItem;
    private String name;
    private BigDecimal pricePerLiter;
    private BigDecimal stock;
    private BigDecimal alertThreshold;

    public FuelDTO() {}

    public FuelDTO(Integer idItem, String name, BigDecimal pricePerLiter, BigDecimal stock, BigDecimal alertThreshold) {
        this.idItem = idItem;
        this.name = name;
        this.pricePerLiter = pricePerLiter;
        this.stock = stock;
        this.alertThreshold = alertThreshold;
    }

    public Integer getIdItem() { return idItem; }
    public void setIdItem(Integer idItem) { this.idItem = idItem; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getPricePerLiter() { return pricePerLiter; }
    public void setPricePerLiter(BigDecimal pricePerLiter) { this.pricePerLiter = pricePerLiter; }
    public BigDecimal getStock() { return stock; }
    public void setStock(BigDecimal stock) { this.stock = stock; }
    public BigDecimal getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(BigDecimal alertThreshold) { this.alertThreshold = alertThreshold; }
}
