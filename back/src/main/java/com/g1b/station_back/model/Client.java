package com.g1b.station_back.model;

import jakarta.persistence.*;

import java.util.List;

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

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<CceCard> cceCards;

    public Client() {}
    public Client(Integer idClient, String firstname, String lastname, String mail, String phoneNumber, List<CceCard> cceCards) {
        this.idClient = idClient; this.firstname = firstname; this.lastname = lastname; this.mail = mail; this.phoneNumber = phoneNumber; this.cceCards = cceCards;
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
    public List<CceCard> getCceCards() {return cceCards;}
    public void setCceCards(List<CceCard> cceCards) {this.cceCards = cceCards;}
}
