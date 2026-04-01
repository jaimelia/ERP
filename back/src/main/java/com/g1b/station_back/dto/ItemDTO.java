package com.g1b.station_back.dto;

import java.math.BigDecimal;
import java.util.List;

public class ItemDTO {
    private Integer idItem;
    private String name;
    private ItemTypeDTO type;
    private BigDecimal stock;
    private BigDecimal alertThreshold;
    private BigDecimal autoRestockQuantity;
    private List<ItemPriceDTO> prices;

    public ItemDTO() {}

    public ItemDTO(Integer idItem, String name, ItemTypeDTO type, BigDecimal stock, BigDecimal alertThreshold, BigDecimal autoRestockQuantity, List<ItemPriceDTO> prices) {
        this.idItem = idItem;
        this.name = name;
        this.type = type;
        this.stock = stock;
        this.alertThreshold = alertThreshold;
        this.autoRestockQuantity = autoRestockQuantity;
        this.prices = prices;
    }

    public Integer getIdItem() { return idItem; }
    public void setIdItem(Integer idItem) { this.idItem = idItem; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ItemTypeDTO getType() { return type; }
    public void setType(ItemTypeDTO type) { this.type = type; }
    public BigDecimal getStock() { return stock; }
    public void setStock(BigDecimal stock) { this.stock = stock; }
    public BigDecimal getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(BigDecimal alertThreshold) { this.alertThreshold = alertThreshold; }
    public BigDecimal getAutoRestockQuantity() { return autoRestockQuantity; }
    public void setAutoRestockQuantity(BigDecimal autoRestockQuantity) { this.autoRestockQuantity = autoRestockQuantity; }
    public List<ItemPriceDTO> getPrices() { return prices; }
    public void setPrices(List<ItemPriceDTO> prices) { this.prices = prices; }
}
