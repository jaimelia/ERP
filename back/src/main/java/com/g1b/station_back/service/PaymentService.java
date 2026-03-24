package com.g1b.station_back.service;

import com.g1b.station_back.dto.PaymentRequestDTO;
import com.g1b.station_back.dto.PaymentResponseDTO;
import com.g1b.station_back.dto.PaymentStatus;
import com.g1b.station_back.exception.PaymentExcessException;
import com.g1b.station_back.model.CceCard;
import com.g1b.station_back.model.Transaction;
import com.g1b.station_back.model.TransactionPayment;
import com.g1b.station_back.model.enums.PaymentMethod;
import com.g1b.station_back.model.enums.TransactionStatus;
import com.g1b.station_back.repository.CceCardRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.g1b.station_back.repository.TransactionRepository;
import com.g1b.station_back.repository.TransactionPaymentRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class PaymentService {
    private final TransactionRepository transactionRepository;
    private final TransactionPaymentRepository transactionPaymentRepository;
    private final CceCardRepository cceCardRepository;


    public PaymentService(TransactionRepository transactionRepository, TransactionPaymentRepository transactionPaymentRepository, CceCardRepository cceCardRepository) {
        this.transactionRepository = transactionRepository;
        this.transactionPaymentRepository = transactionPaymentRepository;
        this.cceCardRepository = cceCardRepository;
    }

    @Transactional
    public PaymentResponseDTO handlePaymentRequest(PaymentRequestDTO paymentRequestDTO) {
        Transaction transaction = transactionRepository.findById(paymentRequestDTO.transactionId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction id not found"));

        BigDecimal totalToPay = transaction.getRemainingAmount();
        BigDecimal amountPaid = paymentRequestDTO.amount();

        if (amountPaid.compareTo(totalToPay) > 0) {
            throw new PaymentExcessException();
        }
        TransactionPayment newPayment = new TransactionPayment();
        newPayment.setTransaction(transaction);
        newPayment.setPaymentMethod(PaymentMethod.valueOf(paymentRequestDTO.paymentMethod()));
        newPayment.setAmount(amountPaid);
        newPayment.setEndNumCard(paymentRequestDTO.endNumCard());
        newPayment.setDate(LocalDate.now());

        if (paymentRequestDTO.id_cce_card() != null) {
            CceCard cceCard = cceCardRepository.findById(paymentRequestDTO.id_cce_card())
                    .orElseThrow(() -> new IllegalArgumentException("CCE Card not found"));
            newPayment.setCceCard(cceCard);
        }

        TransactionStatus paymentStatus = TransactionStatus.accepted;

        if (newPayment.getPaymentMethod() == PaymentMethod.CreditCard) {
            if (ThreadLocalRandom.current().nextDouble() >= 0.9) {
                paymentStatus = TransactionStatus.canceled;
            }
        }
        newPayment.setStatus(paymentStatus);

        transaction.addPayment(newPayment);
        transactionPaymentRepository.save(newPayment);

        if (paymentStatus == TransactionStatus.canceled) {
            return new PaymentResponseDTO(PaymentStatus.CANCELED, totalToPay, "Payment refused.");
        }

        if (amountPaid.compareTo(totalToPay) == 0) {
            return new PaymentResponseDTO(PaymentStatus.VALIDATED, BigDecimal.ZERO, "Payment successful, transaction completed.");
        }

        BigDecimal newRemaining = totalToPay.subtract(amountPaid);
        return new PaymentResponseDTO(PaymentStatus.VALIDATED, newRemaining, "Partial payment successful.");
    }


}
