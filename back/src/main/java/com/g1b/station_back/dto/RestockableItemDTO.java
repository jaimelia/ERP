package com.g1b.station_back.dto;

import java.math.BigDecimal;

public class RestockableItemDTO {
    private Integer itemId;
    private String name;
    private BigDecimal currentStock;
    private BigDecimal alertThreshold;
    private BigDecimal restockQuantity;

    public RestockableItemDTO() {}

    public RestockableItemDTO(Integer itemId, String name, BigDecimal currentStock, BigDecimal alertThreshold, BigDecimal restockQuantity) {
        this.itemId = itemId;
        this.name = name;
        this.currentStock = currentStock;
        this.alertThreshold = alertThreshold;
        this.restockQuantity = restockQuantity;
    }

    public Integer getItemId() { return itemId; }
    public void setItemId(Integer itemId) { this.itemId = itemId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getCurrentStock() { return currentStock; }
    public void setCurrentStock(BigDecimal currentStock) { this.currentStock = currentStock; }
    public BigDecimal getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(BigDecimal alertThreshold) { this.alertThreshold = alertThreshold; }
    public BigDecimal getRestockQuantity() { return restockQuantity; }
    public void setRestockQuantity(BigDecimal restockQuantity) { this.restockQuantity = restockQuantity; }
}
