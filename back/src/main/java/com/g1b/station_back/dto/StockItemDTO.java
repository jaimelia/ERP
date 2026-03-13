package com.g1b.station_back.dto;

import java.math.BigDecimal;

public class StockItemDTO {
    private String type;
    private Long id;
    private String name;
    private BigDecimal stock;
    private BigDecimal price;

    public StockItemDTO(String type, Long id, String name, BigDecimal stock, BigDecimal price) {
        this.type = type;
        this.id = id;
        this.name = name;
        this.stock = stock;
        this.price = price;
    }

    public String getType() {
        return type;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getStock() {
        return stock;
    }

    public BigDecimal getPrice() {
        return price;
    }
}