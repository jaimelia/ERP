package com.g1b.station_back.dto;

import java.math.BigDecimal;

public abstract class ItemIDTO {
    private Integer idItem;
    private String name;
    private BigDecimal price;
    private BigDecimal stock;

    public ItemIDTO(Integer idItem, String name, BigDecimal price, BigDecimal stock) {
        this.idItem = idItem;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    public Integer getIdItem() { return idItem; }
    public void setIdItem(Integer idItem) { this.idItem = idItem; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getStock() { return stock; }
    public void setStock(BigDecimal stock) { this.stock = stock; }
}
