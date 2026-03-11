package com.g1b.station_back.model;

public class Product {
    private String name;
    private ProductType type;
    private float quantity;
    private float price;

    public String getName() {
        return name;
    }

    public ProductType getType() {
        return type;
    }

    public float getQuantity() {
        return quantity;
    }

    public float getPrice() {
        return price;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(ProductType type) {
        this.type = type;
    }

    public void setQuantity(float quantity) {
        this.quantity = quantity;
    }

    public void setPrice(float price) {
        this.price = price;
    }
}
