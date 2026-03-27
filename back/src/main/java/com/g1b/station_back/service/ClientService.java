package com.g1b.station_back.service;

import com.g1b.station_back.dto.CceTransactionDTO;
import com.g1b.station_back.model.Client;
import com.g1b.station_back.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> getAllClients() {
        return clientRepository.findAllByOrderByIdClientAsc()
                .stream()
                .map(c -> new Client(c.getIdClient(), c.getFirstname(), c.getLastname(), c.getMail(), c.getPhoneNumber(), c.getCceCards()))
                .toList();
    }

    public Client updateClient(Integer id, Client updatedClient) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));

        existingClient.setFirstname(updatedClient.getFirstname());
        existingClient.setLastname(updatedClient.getLastname());
        existingClient.setMail(updatedClient.getMail());
        existingClient.setPhoneNumber(updatedClient.getPhoneNumber());

        Client savedClient = clientRepository.save(existingClient);
        return new Client(savedClient.getIdClient(), savedClient.getFirstname(), savedClient.getLastname(), savedClient.getMail(), savedClient.getPhoneNumber(), savedClient.getCceCards());
    }

    public List<CceTransactionDTO> getClientTransactions(Integer idClient) {
        Client client = clientRepository.findById(idClient).orElseThrow();
        if (client.getCceCards() == null || client.getCceCards().isEmpty()) return List.of();

        return client.getCceCards().stream()
                .flatMap(card -> transactionPaymentRepository.findByCceCard_IdCceCard(card.getIdCceCard()).stream())
                .map(payment -> new CceTransactionDTO(
                        payment.getTransaction().getIdTransaction(),
                        payment.getTransaction().getType(),
                        payment.getDate(),
                        payment.getAmount()
                ))
                .toList();
    }

    //TODO : récuperer les transactions d'un utilisateur
}
