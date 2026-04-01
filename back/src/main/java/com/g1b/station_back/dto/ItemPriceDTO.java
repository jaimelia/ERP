package com.g1b.station_back.dto;

import java.math.BigDecimal;

public class ItemPriceDTO {
    private Integer id;
    private String priceLabel;
    private BigDecimal price;

    public ItemPriceDTO() {}

    public ItemPriceDTO(Integer id, String priceLabel, BigDecimal price) {
        this.id = id;
        this.priceLabel = priceLabel;
        this.price = price;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getPriceLabel() { return priceLabel; }
    public void setPriceLabel(String priceLabel) { this.priceLabel = priceLabel; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
