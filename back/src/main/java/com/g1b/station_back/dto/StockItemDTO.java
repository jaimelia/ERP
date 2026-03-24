package com.g1b.station_back.dto;

import java.math.BigDecimal;

public class StockItemDTO {
    private String type;
    private Long id;
    private String name;
    private BigDecimal stock;
    private BigDecimal price;
    private BigDecimal alertThreshold;

    public StockItemDTO(String type, Long id, String name, BigDecimal stock, BigDecimal price, BigDecimal alertThreshold) {
        this.type = type;
        this.id = id;
        this.name = name;
        this.stock = stock;
        this.price = price;
        this.alertThreshold = alertThreshold;
    }

    public String getType() { return type; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getStock() { return stock; }
    public BigDecimal getPrice() { return price; }
    public BigDecimal getAlertThreshold() { return alertThreshold; }
}