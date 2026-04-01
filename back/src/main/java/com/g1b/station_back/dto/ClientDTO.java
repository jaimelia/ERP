package com.g1b.station_back.dto;

public record ClientDTO(
        Integer idClient,
        String lastname,
        String firstname,
        String mail,
        String phoneNumber
) {}