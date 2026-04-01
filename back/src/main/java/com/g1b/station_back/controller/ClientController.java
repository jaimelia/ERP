package com.g1b.station_back.controller;

import com.g1b.station_back.dto.ClientDTO;
import com.g1b.station_back.dto.CceTransactionDTO;
import com.g1b.station_back.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
	@PreAuthorize("hasAuthority('MANAGE_CUSTOMERS')")
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @PutMapping("/{id}")
	@PreAuthorize("hasAuthority('MANAGE_CUSTOMERS')")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Integer id, @RequestBody ClientDTO clientDTO) {
        return ResponseEntity.ok(clientService.updateClient(id, clientDTO));
    }

    @GetMapping("/{id}/transactions")
	@PreAuthorize("hasAuthority('MANAGE_CUSTOMERS')")
    public ResponseEntity<List<CceTransactionDTO>> getClientTransactions(@PathVariable Integer id) {
        return ResponseEntity.ok(clientService.getClientTransactions(id));
    }
}