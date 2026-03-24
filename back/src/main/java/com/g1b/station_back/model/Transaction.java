package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.PaymentMethod;
import com.g1b.station_back.model.enums.TransactionStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaction")
    private Integer idTransaction;

    @Column(nullable = false)
    private String type;

    @Column(name = "transaction_date")
    private LocalDate transactionDate;

    @Column(name = "is_from_automat", nullable = false)
    private Boolean isFromAutomat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    private List<TransactionLine> lines;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    private List<TransactionPayment> payments;

    public Transaction() {}
    public Transaction(Integer idTransaction, String type, LocalDate transactionDate, Boolean isFromAutomat, TransactionStatus status) {
        this.idTransaction = idTransaction; this.type = type; this.transactionDate = transactionDate; this.isFromAutomat = isFromAutomat; this.status = status;
    }

    // Getters et Setters
    public Integer getIdTransaction() { return idTransaction; }
    public void setIdTransaction(Integer idTransaction) { this.idTransaction = idTransaction; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
    public Boolean getIsFromAutomat() { return isFromAutomat; }
    public void setIsFromAutomat(Boolean isFromAutomat) { this.isFromAutomat = isFromAutomat; }
    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }
    public List<TransactionLine> getLines() { return lines; }
    public void setLines(List<TransactionLine> lines) { this.lines = lines; }
    public List<TransactionPayment> getPayments() { return payments; }
    public void setPayments(List<TransactionPayment> payments) { this.payments = payments; }
}
