package com.g1b.station_back.service;

import com.g1b.station_back.dto.*;
import com.g1b.station_back.model.CceBonusTier;
import com.g1b.station_back.model.CceCard;
import com.g1b.station_back.model.Client;
import com.g1b.station_back.model.enums.CceStatus;
import com.g1b.station_back.repository.CceBonusTierRepository;
import com.g1b.station_back.repository.CceCardRepository;
import com.g1b.station_back.repository.ClientRepository;
import com.g1b.station_back.repository.TransactionPaymentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class CceCardService {
    private final ClientRepository clientRepository;
    private final CceCardRepository cceCardRepository;
    private final TransactionPaymentRepository transactionPaymentRepository;
    private final CceBonusTierRepository tierRepository;

    public CceCardService(ClientRepository clientRepository, CceCardRepository cceCardRepository, TransactionPaymentRepository transactionPaymentRepository, CceBonusTierRepository tierRepository) {
        this.clientRepository = clientRepository;
        this.cceCardRepository = cceCardRepository;
        this.transactionPaymentRepository = transactionPaymentRepository;
        this.tierRepository = tierRepository;
    }

    public List<CceDTO> getAllCceCards() {
        return clientRepository.findAll().stream()
                .filter(client -> client.getCceCard() != null)
                .map(client -> new CceDTO(
                        client.getCceCard().getIdCceCard(),
                        client.getLastname(),
                        client.getFirstname(),
                        client.getMail(),
                        client.getPhoneNumber(),
                        client.getCceCard().getCode(),
                        client.getCceCard().getStatus().name(),
                        client.getCceCard().getCreatedAt(),
                        client.getCceCard().getBalance()
                ))
                .toList();
    }

    public List<CceTransactionDTO> getCceTransactions(Integer idCceCard) {
        return transactionPaymentRepository.findByCceCard_IdCceCard(idCceCard).stream()
                .map(payment -> new CceTransactionDTO(
                        payment.getTransaction().getIdTransaction(),
                        payment.getTransaction().getType(),
                        payment.getDate(),
                        payment.getAmount()
                ))
                .toList();
    }

    public void createCce(CceCreateDTO request) {
        CceCard card = new CceCard();
        card.setBalance(new BigDecimal(request.montant()));
        card.setCreatedAt(LocalDate.now());
        card.setExpiresAt(LocalDate.now().plusYears(3));
        card.setCode(request.code());
        card.setStatus(CceStatus.activated);
        CceCard savedCard = cceCardRepository.save(card);

        Client client = new Client();
        client.setLastname(request.nom());
        client.setFirstname(request.prenom());
        client.setMail(request.email());
        client.setPhoneNumber(request.tel());
        client.setCceCard(savedCard);
        clientRepository.save(client);
    }

    public void editCce(Integer id, CceEditDTO request) {
        cceCardRepository.findById(id).ifPresent(card -> {
            card.setCode(request.code());
            cceCardRepository.save(card);

            clientRepository.findAll().stream()
                    .filter(c -> c.getCceCard() != null && c.getCceCard().getIdCceCard().equals(id))
                    .findFirst()
                    .ifPresent(client -> {
                        client.setLastname(request.nom());
                        client.setFirstname(request.prenom());
                        client.setMail(request.email());
                        client.setPhoneNumber(request.tel());
                        clientRepository.save(client);
                    });
        });
    }

    public void creditCce(Integer id, CceCreditDTO request) {
        cceCardRepository.findById(id).ifPresent(card -> {
            BigDecimal amount = request.amount();

            BigDecimal bonus = tierRepository.findAll().stream()
                    .filter(t -> amount.compareTo(t.getMinAmount()) >= 0)
                    .max(java.util.Comparator.comparing(CceBonusTier::getMinAmount))
                    .map(CceBonusTier::getBonusAmount)
                    .orElse(BigDecimal.ZERO);

            card.setBalance(card.getBalance().add(amount).add(bonus));
            cceCardRepository.save(card);
        });
    }

    public void reeditCce(Integer oldId, CceCreateDTO request) {
        cceCardRepository.findById(oldId).ifPresent(oldCard -> {
            oldCard.setStatus(CceStatus.deactivated);
            cceCardRepository.save(oldCard);
        });

        createCce(request);
    }

    public void toggleStatus(Integer id) {
        cceCardRepository.findById(id).ifPresent(card -> {
            card.setStatus(card.getStatus() == CceStatus.activated ? CceStatus.deactivated : CceStatus.activated);
            cceCardRepository.save(card);
        });
    }
}