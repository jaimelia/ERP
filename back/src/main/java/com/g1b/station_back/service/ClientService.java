package com.g1b.station_back.service;

import com.g1b.station_back.dto.CceTransactionDTO;
import com.g1b.station_back.dto.ClientDTO;
import com.g1b.station_back.model.CceCard;
import com.g1b.station_back.model.Client;
import com.g1b.station_back.model.TransactionPayment;
import com.g1b.station_back.repository.ClientRepository;
import com.g1b.station_back.repository.TransactionPaymentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final TransactionPaymentRepository transactionPaymentRepository;

    public ClientService(ClientRepository clientRepository, TransactionPaymentRepository transactionPaymentRepository) {
        this.clientRepository = clientRepository;
        this.transactionPaymentRepository = transactionPaymentRepository;
    }

    public List<ClientDTO> getAllClients() {
        List<ClientDTO> clientDTOs = new ArrayList<>();
        for (Client client : clientRepository.findAll()) {
            clientDTOs.add(convertToDTO(client));
        }
        return clientDTOs;
    }

    public ClientDTO updateClient(Integer id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id).orElseThrow();
        client.setFirstname(clientDTO.firstname());
        client.setLastname(clientDTO.lastname());
        client.setMail(clientDTO.mail());
        client.setPhoneNumber(clientDTO.phoneNumber());
        return convertToDTO(clientRepository.save(client));
    }

    public List<CceTransactionDTO> getClientTransactions(Integer idClient) {
        Client client = clientRepository.findById(idClient).orElseThrow();
        List<CceTransactionDTO> transactions = new ArrayList<>();

        if (client.getCceCards() != null) {
            for (CceCard card : client.getCceCards()) {
                List<TransactionPayment> payments = transactionPaymentRepository.findByCceCard_IdCceCard(card.getIdCceCard());
                for (TransactionPayment payment : payments) {
                    transactions.add(new CceTransactionDTO(
                            payment.getTransaction().getIdTransaction(),
                            payment.getTransaction().getType(),
                            payment.getDate(),
                            payment.getAmount()
                    ));
                }
            }
        }

        return transactions;
    }

    private ClientDTO convertToDTO(Client client) {
        return new ClientDTO(
                client.getIdClient(),
                client.getLastname(),
                client.getFirstname(),
                client.getMail(),
                client.getPhoneNumber()
        );
    }
}