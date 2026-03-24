package com.g1b.station_back.model;

import jakarta.persistence.*;

@Entity
@Table(name = "items")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Integer idItem;

    @Column(nullable = false)
    private String name;

    public Item() {}
    public Item(Integer idItem, String name) {
        this.idItem = idItem; this.name = name;
    }

    public Integer getIdItem() { return idItem; }
    public void setIdItem(Integer idItem) { this.idItem = idItem; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

