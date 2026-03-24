package com.g1b.station_back.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clients")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_client")
    private Integer idClient;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(nullable = false)
    private String mail;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "id_cce_card", nullable = false)
    private CceCard cceCard;

    public Client() {}
    public Client(Integer idClient, String firstname, String lastname, String mail, String phoneNumber, CceCard cceCard) {
        this.idClient = idClient; this.firstname = firstname; this.lastname = lastname; this.mail = mail; this.phoneNumber = phoneNumber; this.cceCard = cceCard;
    }

    public Integer getIdClient() { return idClient; }
    public void setIdClient(Integer idClient) { this.idClient = idClient; }
    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }
    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }
    public String getMail() { return mail; }
    public void setMail(String mail) { this.mail = mail; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public CceCard getCceCard() { return cceCard; }
    public void setCceCard(CceCard cceCard) { this.cceCard = cceCard; }
}
