package com.g1b.station_back.model;

import jakarta.persistence.*;

@Entity
@Table(name = "regional_guidelines")
public class RegionalGuideline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_regional_guideline")
    private Integer idRegionalGuideline;

    @Column(nullable = false)
    private String object;

    @Column(nullable = false)
    private String content;

    public RegionalGuideline() {}
    public RegionalGuideline(Integer idRegionalGuideline, String object, String content) {
        this.idRegionalGuideline = idRegionalGuideline; this.object = object; this.content = content;
    }

    public Integer getIdRegionalGuideline() { return idRegionalGuideline; }
    public void setIdRegionalGuideline(Integer idRegionalGuideline) { this.idRegionalGuideline = idRegionalGuideline; }
    public String getObject() { return object; }
    public void setObject(String object) { this.object = object; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}