package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.RestockStatus;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "restocks")
public class Restock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_restock")
    private Integer idRestock;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;

    @Column(name = "restock_date", nullable = false)
    private LocalDate restockDate;

    @ManyToOne
    @JoinColumn(name = "id_item", nullable = false)
    private Item item;

    @Enumerated(EnumType.STRING)
	@JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false)
    private RestockStatus status;

    public Restock() {}
    public Restock(Integer idRestock, BigDecimal quantity, LocalDate restockDate, Item item, RestockStatus status) {
        this.idRestock = idRestock; this.quantity = quantity; this.restockDate = restockDate; this.item = item; this.status = status;
    }

    public Integer getIdRestock() { return idRestock; }
    public void setIdRestock(Integer idRestock) { this.idRestock = idRestock; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public LocalDate getRestockDate() { return restockDate; }
    public void setRestockDate(LocalDate restockDate) { this.restockDate = restockDate; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
    public RestockStatus getStatus() { return status; }
    public void setStatus(RestockStatus status) { this.status = status; }
}

