package com.g1b.station_back.model;


import com.g1b.station_back.model.enums.PaymentMethod;
import com.g1b.station_back.model.enums.TransactionStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transaction_payments")
public class TransactionPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaction_payment")
    private Integer idTransactionPayment;

    @ManyToOne
    @JoinColumn(name = "id_transaction", nullable = false)
    private Transaction transaction;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(nullable = false, precision = 5, scale = 3)
    private BigDecimal amount;

    @Column(name = "end_num_card", length = 4)
    private String endNumCard;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "id_cce_card")
    private CceCard cceCard;

    public TransactionPayment() {}
    public TransactionPayment(Integer idTransactionPayment, Transaction transaction, PaymentMethod paymentMethod, BigDecimal amount, String endNumCard, TransactionStatus status, LocalDate date, CceCard cceCard) {
        this.idTransactionPayment = idTransactionPayment; this.transaction = transaction; this.paymentMethod = paymentMethod; this.amount = amount; this.endNumCard = endNumCard; this.status = status; this.date = date; this.cceCard = cceCard;
    }

    // Getters et Setters...
    public Integer getIdTransactionPayment() { return idTransactionPayment; }
    public void setIdTransactionPayment(Integer idTransactionPayment) { this.idTransactionPayment = idTransactionPayment; }
    public Transaction getTransaction() { return transaction; }
    public void setTransaction(Transaction transaction) { this.transaction = transaction; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getEndNumCard() { return endNumCard; }
    public void setEndNumCard(String endNumCard) { this.endNumCard = endNumCard; }
    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public CceCard getCceCard() { return cceCard; }
    public void setCceCard(CceCard cceCard) { this.cceCard = cceCard; }
}