package com.g1b.station_back.model;

import com.g1b.station_back.model.enums.Role;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Integer idUser;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

	@Enumerated(EnumType.STRING)
	@JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false)
    private Role role;

    @Column(name = "uses_dark_mode", nullable = false)
    private Boolean usesDarkMode;

    @Column(name = "tile_layout", columnDefinition = "TEXT")
    private String tileLayout;

    public User() {}
    public User(Integer idUser, String username, String password, String email, Role role, Boolean usesDarkMode, String tileLayout) {
        this.idUser = idUser; this.username = username; this.password = password; this.email = email; this.role = role; this.usesDarkMode = usesDarkMode; this.tileLayout = tileLayout;
    }

    public Integer getIdUser() { return idUser; }
    public void setIdUser(Integer idUser) { this.idUser = idUser; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Boolean getUsesDarkMode() { return usesDarkMode; }
    public void setUsesDarkMode(Boolean usesDarkMode) { this.usesDarkMode = usesDarkMode; }
    public String getTileLayout() { return tileLayout; }
    public void setTileLayout(String tileLayout) { this.tileLayout = tileLayout; }
}
