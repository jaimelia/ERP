package com.g1b.station_back.dto;

import java.math.BigDecimal;

public class TransactionItemDTO extends ItemIDTO {
    private String typeName;

    public TransactionItemDTO(Integer idItem, String name, BigDecimal price, BigDecimal stock, String typeName) {
        super(idItem, name, price, stock);
        this.typeName = typeName;
    }

    public String getTypeName() { return typeName; }
    public void setTypeName(String typeName) { this.typeName = typeName; }
}
