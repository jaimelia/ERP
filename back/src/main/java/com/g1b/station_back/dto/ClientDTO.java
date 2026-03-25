package com.g1b.station_back.dto;

import com.g1b.station_back.model.CceCard;

public record ClientDTO(
        Integer idClient,
        String surname,
        String firstname,
        String email,
        String phoneNumber,
        CceCard cceCard
) {
}
