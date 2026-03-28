package com.g1b.station_back.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtils {


	@Value("${jwt.secret:}")
	private String jwtSecret;

	@Value("${jwt.expirationMs:86400000}") // 1 jour par défaut
	private long jwtExpirationMs;

	private SecretKey secretKey;

	@PostConstruct
	public void init() {
		try {
			if (jwtSecret == null || jwtSecret.isEmpty()) {
				secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
				jwtSecret = Base64.getEncoder().encodeToString(secretKey.getEncoded());
				System.out.println("JWT secret auto-generated (HS512) : " + jwtSecret);
			} else {
				secretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret));
			}
		} catch (IllegalArgumentException e) {
			throw new IllegalStateException("The JWT secret must be in valid Base64 abd >= 512 bits for HS512", e);
		}
	}

	public String generateJwtToken(String username) {
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
				.signWith(secretKey, SignatureAlgorithm.HS512)
				.compact();
	}

	public String getUserNameFromJwtToken(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}

	public boolean validateJwtToken(String authToken) {
		try {
			Jwts.parserBuilder()
					.setSigningKey(secretKey)
					.build()
					.parseClaimsJws(authToken);
			return true;
		} catch (JwtException e) {
			System.err.println("JWT validation error: " + e.getMessage());
		}
		return false;
	}

	public String getJwtSecret() {
		return jwtSecret;
	}
}