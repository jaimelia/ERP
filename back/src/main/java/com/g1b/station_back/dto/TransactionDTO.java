package com.g1b.station_back.dto;

import com.g1b.station_back.model.enums.TransactionStatus;

import java.time.LocalDate;

public class TransactionDTO {
    private Integer idTransaction;
    private String type;
    private LocalDate transactionDate;
    private Boolean isFromAutomat;
    private TransactionStatus status;

    public TransactionDTO(Integer idTransaction, String type, LocalDate transactionDate, Boolean isFromAutomat, TransactionStatus status) {
        this.idTransaction = idTransaction;
        this.type = type;
        this.transactionDate = transactionDate;
        this.isFromAutomat = isFromAutomat;
        this.status = status;
    }

    public Integer getIdTransaction() {
        return idTransaction;
    }

    public void setIdTransaction(Integer idTransaction) {
        this.idTransaction = idTransaction;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public Boolean getIsFromAutomat() {
        return isFromAutomat;
    }

    public void setIsFromAutomat(Boolean isFromAutomat) {
        this.isFromAutomat = isFromAutomat;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }
}
