package com.g1b.station_back.dto;

import com.g1b.station_back.model.enums.RestockStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RestockDTO {
    private Integer idRestock;
    private BigDecimal quantity;
    private LocalDate restockDate;
    private Integer itemId;
    private String itemName;
    private String itemType;
    private RestockStatus status;

    public RestockDTO() {}

    public RestockDTO(Integer idRestock, BigDecimal quantity, LocalDate restockDate,
                      Integer itemId, String itemName, String itemType, RestockStatus status) {
        this.idRestock = idRestock;
        this.quantity = quantity;
        this.restockDate = restockDate;
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemType = itemType;
        this.status = status;
    }

    public Integer getIdRestock() { return idRestock; }
    public void setIdRestock(Integer idRestock) { this.idRestock = idRestock; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public LocalDate getRestockDate() { return restockDate; }
    public void setRestockDate(LocalDate restockDate) { this.restockDate = restockDate; }
    public Integer getItemId() { return itemId; }
    public void setItemId(Integer itemId) { this.itemId = itemId; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }
    public RestockStatus getStatus() { return status; }
    public void setStatus(RestockStatus status) { this.status = status; }
}
