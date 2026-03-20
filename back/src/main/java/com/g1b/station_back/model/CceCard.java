package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.CceStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cce_cards")
public class CceCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cce_card")
    private Integer idCceCard;

    @Column(nullable = false, precision = 5, scale = 3)
    private BigDecimal balance;

    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDate expiresAt;

    @Column(nullable = false)
    private Integer code;

    @Column(name = "minimum_credit_amount", nullable = false)
    private Integer minimumCreditAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CceStatus status;

    public CceCard() {}
    public CceCard(Integer idCceCard, BigDecimal balance, LocalDate createdAt, LocalDate expiresAt, Integer code, Integer minimumCreditAmount, CceStatus status) {
        this.idCceCard = idCceCard; this.balance = balance; this.createdAt = createdAt; this.expiresAt = expiresAt; this.code = code; this.minimumCreditAmount = minimumCreditAmount; this.status = status;
    }

    public Integer getIdCceCard() { return idCceCard; }
    public void setIdCceCard(Integer idCceCard) { this.idCceCard = idCceCard; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
    public LocalDate getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDate expiresAt) { this.expiresAt = expiresAt; }
    public Integer getCode() { return code; }
    public void setCode(Integer code) { this.code = code; }
    public Integer getMinimumCreditAmount() { return minimumCreditAmount; }
    public void setMinimumCreditAmount(Integer minimumCreditAmount) { this.minimumCreditAmount = minimumCreditAmount; }
    public CceStatus getStatus() { return status; }
    public void setStatus(CceStatus status) { this.status = status; }
}

