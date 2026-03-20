package com.g1b.station_back.repository;

import com.g1b.station_back.model.CceCard;
import com.g1b.station_back.model.Client;
import com.g1b.station_back.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
}

