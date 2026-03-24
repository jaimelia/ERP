package com.g1b.station_back.service;

import com.g1b.station_back.dto.CceDTO;
import com.g1b.station_back.model.enums.CceStatus;
import com.g1b.station_back.repository.CceCardRepository;
import com.g1b.station_back.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CceCardService {
    private final ClientRepository clientRepository;
    private final CceCardRepository cceCardRepository;

    public CceCardService(ClientRepository clientRepository, CceCardRepository cceCardRepository) {
        this.clientRepository = clientRepository;
        this.cceCardRepository = cceCardRepository;
    }

    public List<CceDTO> getAllCceCards() {
        return clientRepository.findAll().stream()
                .filter(client -> client.getCceCard() != null)
                .map(client -> new CceDTO(
                        client.getCceCard().getIdCceCard(),
                        client.getLastname(),
                        client.getFirstname(),
                        client.getCceCard().getCode(),
                        client.getCceCard().getStatus().name(),
                        client.getCceCard().getCreatedAt(),
                        client.getCceCard().getBalance()
                ))
                .toList();
    }

    public void toggleStatus(Integer id) {
        cceCardRepository.findById(id).ifPresent(card -> {
            card.setStatus(card.getStatus() == CceStatus.activated ? CceStatus.deactivated : CceStatus.activated);
            cceCardRepository.save(card);
        });
    }
}