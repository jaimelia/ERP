package com.g1b.station_back.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CceDTO(Integer id, String nom, String prenom, String email, String tel, Integer code, String statut, LocalDate dateCreation, BigDecimal montantCredite) {}