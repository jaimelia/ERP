package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.PaymentStatus;
import com.g1b.station_back.model.enums.TransactionStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

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
    private LocalDateTime transactionDate;

    @Column(name = "is_from_automat", nullable = false)
    private Boolean isFromAutomat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    private User user;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    private Set<TransactionLine> lines;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    private Set<TransactionPayment> payments;

    public Transaction() {}
    public Transaction(Integer idTransaction, String type, LocalDateTime transactionDate, Boolean isFromAutomat, TransactionStatus status) {
        this.idTransaction = idTransaction; this.type = type; this.transactionDate = transactionDate; this.isFromAutomat = isFromAutomat; this.status = status;
    }

    // Getters et Setters
    public Integer getIdTransaction() { return idTransaction; }
    public void setIdTransaction(Integer idTransaction) { this.idTransaction = idTransaction; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
    public Boolean getIsFromAutomat() { return isFromAutomat; }
    public void setIsFromAutomat(Boolean isFromAutomat) { this.isFromAutomat = isFromAutomat; }
    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }
    public Set<TransactionLine> getLines() { return lines; }
    public void setLines(Set<TransactionLine> lines) { this.lines = lines; }
    public Set<TransactionPayment> getPayments() { return payments; }
    public void setPayments(Set<TransactionPayment> payments) { this.payments = payments; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BigDecimal getTotalAmount() {
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (TransactionLine line : lines) {
            totalAmount = totalAmount.add(line.getTotalAmount());
        }
            return totalAmount;
    }

    public BigDecimal getRemainingAmount() {
        BigDecimal paidAmount = BigDecimal.ZERO;
        for (TransactionPayment payment : payments) {
            if (payment.getStatus().equals(PaymentStatus.accepted)) paidAmount = paidAmount.add(payment.getAmount());
        }
        return getTotalAmount().subtract(paidAmount);
    }

    public void addPayment(TransactionPayment payment) {
        payments.add(payment);
        payment.setTransaction(this);
    }
}
