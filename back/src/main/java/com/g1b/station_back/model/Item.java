package com.g1b.station_back.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Integer idItem;

    @Column(nullable = false)
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "type_id", nullable = false)
    private ItemType type;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPrice> prices = new ArrayList<>();

    @Column(precision = 10, scale = 3)
    private BigDecimal stock;

    @Column(name = "alert_threshold", precision = 10, scale = 3)
    private BigDecimal alertThreshold;

    @Column(name = "auto_restock_quantity", precision = 10, scale = 3)
    private BigDecimal autoRestockQuantity;

    public Item() {}

    public Item(Integer idItem, String name, ItemType type, BigDecimal stock, BigDecimal alertThreshold, BigDecimal autoRestockQuantity) {
        this.idItem = idItem;
        this.name = name;
        this.type = type;
        this.stock = stock;
        this.alertThreshold = alertThreshold;
        this.autoRestockQuantity = autoRestockQuantity;
    }

    public Integer getIdItem() { return idItem; }
    public void setIdItem(Integer idItem) { this.idItem = idItem; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ItemType getType() { return type; }
    public void setType(ItemType type) { this.type = type; }
    public List<ItemPrice> getPrices() { return prices; }
    public void setPrices(List<ItemPrice> prices) { this.prices = prices; }
    public BigDecimal getStock() { return stock; }
    public void setStock(BigDecimal stock) { this.stock = stock; }
    public BigDecimal getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(BigDecimal alertThreshold) { this.alertThreshold = alertThreshold; }
    public BigDecimal getAutoRestockQuantity() { return autoRestockQuantity; }
    public void setAutoRestockQuantity(BigDecimal autoRestockQuantity) { this.autoRestockQuantity = autoRestockQuantity; }
}
