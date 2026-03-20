package com.g1b.station_back.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "transactions_lines")
public class TransactionLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaction_line")
    private Integer idTransactionLine;

    @Column(nullable = false)
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "id_transaction", nullable = false)
    private Transaction transaction;

    @Column(name = "total_amount", precision = 5, scale = 3)
    private BigDecimal totalAmount;

    @ManyToOne
    @JoinColumn(name = "id_item", nullable = false)
    private Item item;

    public TransactionLine() {}
    public TransactionLine(Integer idTransactionLine, Integer quantity, Transaction transaction, BigDecimal totalAmount, Item item) {
        this.idTransactionLine = idTransactionLine; this.quantity = quantity; this.transaction = transaction; this.totalAmount = totalAmount; this.item = item;
    }

    public Integer getIdTransactionLine() { return idTransactionLine; }
    public void setIdTransactionLine(Integer idTransactionLine) { this.idTransactionLine = idTransactionLine; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Transaction getTransaction() { return transaction; }
    public void setTransaction(Transaction transaction) { this.transaction = transaction; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
}
