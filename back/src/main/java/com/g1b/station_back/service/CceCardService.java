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
import org.springframework.transaction.annotation.Transactional;

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
        return cceCardRepository.findAll().stream()
                .map(card -> new CceDTO(
                        card.getIdCceCard(),
                        card.getClient().getLastname(),
                        card.getClient().getFirstname(),
                        card.getClient().getMail(),
                        card.getClient().getPhoneNumber(),
                        card.getCode(),
                        card.getStatus().name(),
                        card.getCreatedAt(),
                        card.getBalance()
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

    @Transactional
    public void createCce(CceCreateDTO request) {
        Client client = new Client();
        client.setLastname(request.nom());
        client.setFirstname(request.prenom());
        client.setMail(request.email());
        client.setPhoneNumber(request.tel());
        // Sauvegarde immédiate pour générer l'ID
        client = clientRepository.save(client);

        CceCard card = new CceCard();
        card.setClient(client);
        card.setBalance(new BigDecimal(request.montant()));
        card.setCreatedAt(LocalDate.now());
        card.setExpiresAt(LocalDate.now().plusYears(3));
        card.setCode(request.code());
        card.setStatus(CceStatus.activated);
        cceCardRepository.save(card);
    }

    public void editCce(Integer id, CceEditDTO request) {
        cceCardRepository.findById(id).ifPresent(card -> {
            card.setCode(request.code());
            cceCardRepository.save(card);

            Client client = card.getClient();
            client.setLastname(request.nom());
            client.setFirstname(request.prenom());
            client.setMail(request.email());
            client.setPhoneNumber(request.tel());
            clientRepository.save(client);
        });
    }

    public void creditCce(Integer id, CceCreditDTO request) {
        cceCardRepository.findById(id).ifPresent(card -> {
            BigDecimal amount = request.amount();

            BigDecimal bonus = tierRepository.findAll().stream()
                    .filter(t -> amount.compareTo(t.getMinAmount()) >= 0)
                    .max(Comparator.comparing(CceBonusTier::getMinAmount))
                    .map(CceBonusTier::getBonusAmount)
                    .orElse(BigDecimal.ZERO);

            card.setBalance(card.getBalance().add(amount).add(bonus));
            cceCardRepository.save(card);
        });
    }

    @Transactional
    public void reeditCce(Integer oldId, CceCreateDTO request) {
        CceCard oldCard = cceCardRepository.findById(oldId).orElseThrow(() -> new RuntimeException("Ancienne carte introuvable"));
        Client client = oldCard.getClient();

        client.setLastname(request.nom());
        client.setFirstname(request.prenom());
        client.setMail(request.email());
        client.setPhoneNumber(request.tel());
        clientRepository.save(client);

        BigDecimal transferredBalance = oldCard.getBalance();
        oldCard.setBalance(BigDecimal.ZERO);
        oldCard.setStatus(CceStatus.deactivated);
        cceCardRepository.save(oldCard);

        CceCard newCard = new CceCard();
        newCard.setClient(client);
        newCard.setBalance(transferredBalance);
        newCard.setCreatedAt(LocalDate.now());
        newCard.setExpiresAt(LocalDate.now().plusYears(3));
        newCard.setCode(request.code());
        newCard.setStatus(CceStatus.activated);
        cceCardRepository.save(newCard);
    }

    public void toggleStatus(Integer id) {
        cceCardRepository.findById(id).ifPresent(card -> {
            card.setStatus(card.getStatus() == CceStatus.activated ? CceStatus.deactivated : CceStatus.activated);
            cceCardRepository.save(card);
        });
    }
}