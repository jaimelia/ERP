package com.g1b.station_back.service;

import com.g1b.station_back.dto.PaymentRequestDTO;
import com.g1b.station_back.dto.PaymentResponseDTO;
import com.g1b.station_back.model.CceCard;
import com.g1b.station_back.model.Transaction;
import com.g1b.station_back.model.TransactionPayment;
import com.g1b.station_back.model.enums.PaymentMethod;
import com.g1b.station_back.model.enums.PaymentStatus;
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

  public PaymentService(TransactionRepository transactionRepository,
      TransactionPaymentRepository transactionPaymentRepository, CceCardRepository cceCardRepository) {
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
      return new PaymentResponseDTO(null, PaymentResponseDTO.PaymentStatus.EXCESS,
          totalToPay, "Le total payé est supérieur au reste à payer. Paiement annulé.");
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

    PaymentStatus paymentStatus = PaymentStatus.accepted;
    if (newPayment.getPaymentMethod() == PaymentMethod.CreditCard
        && ThreadLocalRandom.current().nextDouble() >= 0.9) {
      paymentStatus = PaymentStatus.canceled;
    }
    newPayment.setStatus(paymentStatus);
    transaction.addPayment(newPayment);
    transactionPaymentRepository.save(newPayment);

    if (paymentStatus == PaymentStatus.canceled) {
      return new PaymentResponseDTO(newPayment.getIdTransactionPayment(), PaymentResponseDTO.PaymentStatus.CANCELED,
          totalToPay, "Paiement par carte refusé.");
    }

    if (amountPaid.compareTo(totalToPay) == 0) {
      return new PaymentResponseDTO(newPayment.getIdTransactionPayment(), PaymentResponseDTO.PaymentStatus.VALIDATED,
          BigDecimal.ZERO, "Paiement validé, transaction complétée.");
    }

    return new PaymentResponseDTO(newPayment.getIdTransactionPayment(), PaymentResponseDTO.PaymentStatus.PARTIAL,
        totalToPay.subtract(amountPaid), "Paiement partiel validé.");
  }

  public PaymentResponseDTO cancelPayment(Integer paymentId) {
    TransactionPayment payment = transactionPaymentRepository.findById(paymentId)
        .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
    Transaction transaction = payment.getTransaction();
    payment.setStatus(PaymentStatus.canceled);
    BigDecimal remainingAmount = transaction.getRemainingAmount();
    transactionPaymentRepository.save(payment);
    return new PaymentResponseDTO(paymentId, PaymentResponseDTO.PaymentStatus.CANCELED, remainingAmount,
        "Paiement annulé.");
  }

}
