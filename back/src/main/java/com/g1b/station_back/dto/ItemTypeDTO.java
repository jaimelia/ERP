package com.g1b.station_back.dto;

public class ItemTypeDTO {
    private Integer id;
    private String name;
    private String unitOfMeasure;
    private boolean isStockManaged;

    public ItemTypeDTO() {}

    public ItemTypeDTO(Integer id, String name, String unitOfMeasure, boolean isStockManaged) {
        this.id = id;
        this.name = name;
        this.unitOfMeasure = unitOfMeasure;
        this.isStockManaged = isStockManaged;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getUnitOfMeasure() { return unitOfMeasure; }
    public void setUnitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; }
    public boolean isStockManaged() { return isStockManaged; }
    public void setStockManaged(boolean stockManaged) { isStockManaged = stockManaged; }
}
