package com.flightapp.authservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.JwtException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.flightapp.authservice.entity.User;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

	private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.expiration}")
	private long expiration;

	private Key getSigningKey() {
		return Keys.hmacShaKeyFor(secret.getBytes());
	}

	public String generateToken(User user) {

		log.info("Generating token for user: {}", user.getEmail());

		return Jwts.builder().setSubject(user.getEmail()).claim("userId", user.getId())
				.claim("role", user.getRole().name()).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expiration))
				.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
	}

	private Claims extractAllClaims(String token) {
		try {
			return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();

		} catch (JwtException e) {
			log.error("JWT parsing failed: {}", e.getMessage());
			throw new RuntimeException("Invalid or expired JWT token");
		} catch (Exception e) {
			log.error("Unexpected error while parsing JWT: {}", e.getMessage());
			throw new RuntimeException("JWT processing error");
		}
	}

	public String extractEmail(String token) {
		return extractAllClaims(token).getSubject();
	}

	public String extractRole(String token) {
		return extractAllClaims(token).get("role", String.class);
	}

	public Long extractUserId(String token) {
		return extractAllClaims(token).get("userId", Long.class);
	}

	public boolean validateToken(String token) {
		try {
			extractAllClaims(token);
			return true;
		} catch (Exception e) {
			log.warn("JWT validation failed: {}", e.getMessage());
			return false;
		}
	}
}