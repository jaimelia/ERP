package com.g1b.station_back.service;

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
                .map(c -> new Client(c.getIdClient(), c.getFirstname(), c.getLastname(), c.getMail(), c.getPhoneNumber(), c.getCceCard()))
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
        return new Client(savedClient.getIdClient(), savedClient.getFirstname(), savedClient.getLastname(), savedClient.getMail(), savedClient.getPhoneNumber(), savedClient.getCceCard());
    }

    //TODO : récuperer les transactions d'un utilisateur
}
