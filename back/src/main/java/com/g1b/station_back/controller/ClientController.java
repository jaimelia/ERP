package com.g1b.station_back.controller;

import com.g1b.station_back.dto.TransactionDTO;
import com.g1b.station_back.model.Client;
import com.g1b.station_back.model.Transaction;
import com.g1b.station_back.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable("id") Integer id, @RequestBody Client updatedClient) {
        Client updated = clientService.updateClient(id, updatedClient);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<TransactionDTO>> getClientTransactions(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(clientService.getTransactionsByClientId(id));
    }
}
