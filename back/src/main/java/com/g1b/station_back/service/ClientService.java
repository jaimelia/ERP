package com.g1b.station_back.service;

import com.g1b.station_back.dto.TransactionDTO;
import com.g1b.station_back.model.Client;
import com.g1b.station_back.repository.ClientRepository;
import com.g1b.station_back.repository.TransactionPaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final TransactionPaymentRepository transactionPaymentRepository;

    public ClientService(ClientRepository clientRepository, TransactionPaymentRepository transactionPaymentRepository) {
        this.clientRepository = clientRepository;
        this.transactionPaymentRepository = transactionPaymentRepository;
    }

    public List<Client> getAllClients() {
        return clientRepository.findAllByOrderByIdClientAsc();
    }

    public Client updateClient(Integer id, Client updatedClient) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));

        existingClient.setFirstname(updatedClient.getFirstname());
        existingClient.setLastname(updatedClient.getLastname());
        existingClient.setMail(updatedClient.getMail());
        existingClient.setPhoneNumber(updatedClient.getPhoneNumber());

        return clientRepository.save(existingClient);
    }

    public List<TransactionDTO> getTransactionsByClientId(Integer clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));

        return transactionPaymentRepository.findByCceCard_IdCceCard(client.getCceCard().getIdCceCard())
                .stream()
                .map(tp -> {
                    var tx = tp.getTransaction();
                    return new TransactionDTO(tx.getIdTransaction(), tx.getType(), tx.getTransactionDate(), tx.getIsFromAutomat(), tx.getStatus());
                })
                .distinct()
                .collect(Collectors.toList());
    }
}
