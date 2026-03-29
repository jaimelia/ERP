package com.g1b.station_back.model.enums;

import static com.g1b.station_back.config.Permission.*;

import com.g1b.station_back.config.Permission;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public enum Role {
	employee(Set.of(READ_CHARGERS, READ_ITEMS, READ_RESTOCKS, MANAGE_CCE, MANAGE_CUSTOMERS, CREATE_PAYMENT, UPDATE_PUMPS, READ_TRANSACTIONS, CREATE_TRANSACTIONS, CANCEL_TRANSACTIONS)),
	manager(Set.of(Permission.values()));

	private final Set<Permission> permissions;

	Role(Set<Permission> permissions) {
		this.permissions = permissions;
	}

	public List<GrantedAuthority> getAuthorities() {
		List<GrantedAuthority> authorities = new ArrayList<>(
				permissions.stream()
						.map(p -> new SimpleGrantedAuthority(p.name()))
						.toList()
		);
		authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
		return authorities;
	}
}
