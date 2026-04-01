package com.g1b.station_back.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "item_prices")
public class ItemPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "price_label", nullable = false)
    private String priceLabel;

    @Column(nullable = false, precision = 5, scale = 3)
    private BigDecimal price;

    @ManyToOne(optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    public ItemPrice() {}

    public ItemPrice(Integer id, String priceLabel, BigDecimal price, Item item) {
        this.id = id;
        this.priceLabel = priceLabel;
        this.price = price;
        this.item = item;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getPriceLabel() { return priceLabel; }
    public void setPriceLabel(String priceLabel) { this.priceLabel = priceLabel; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
}
