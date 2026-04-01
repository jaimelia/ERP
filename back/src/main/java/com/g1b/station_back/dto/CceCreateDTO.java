package com.g1b.station_back.dto;

import java.math.BigDecimal;

public record CceCreateDTO(String nom, String prenom, String email, String tel, String code, BigDecimal montant) {}