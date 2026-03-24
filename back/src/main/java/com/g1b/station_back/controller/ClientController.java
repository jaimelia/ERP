package com.g1b.station_back.controller;

import com.g1b.station_back.model.Client;
import com.g1b.station_back.service.ClientService;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/update/{id}")
    public ResponseEntity<?> updateClient(
            @PathVariable("id") Integer id,
            @RequestParam("firstname") String firstname,
            @RequestParam("lastname") String lastname,
            @RequestParam("mail") String mail,
            @RequestParam("phoneNumber") String phoneNumber
    ) {
        try {
            Client updatedClient = new Client();
            updatedClient.setFirstname(firstname);
            updatedClient.setLastname(lastname);
            updatedClient.setMail(mail);
            updatedClient.setPhoneNumber(phoneNumber);

            Client updated = clientService.updateClient(id, updatedClient);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
