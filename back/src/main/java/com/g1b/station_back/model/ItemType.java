package com.g1b.station_back.model;

import jakarta.persistence.*;

@Entity
@Table(name = "item_types")
public class ItemType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "unit_of_measure", nullable = false)
    private String unitOfMeasure;

    @Column(name = "is_stock_managed", nullable = false)
    private boolean isStockManaged;

    public ItemType() {}

    public ItemType(Integer id, String name, String unitOfMeasure, boolean isStockManaged) {
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
