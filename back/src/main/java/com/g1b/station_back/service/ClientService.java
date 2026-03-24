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
                .map(c -> new Client(c.getIdClient(), c.getFirstname(), c.getLastname(), c.getPhoneNumber(), c.getMail(), c.getCceCard()))
                .toList();
    }
}
