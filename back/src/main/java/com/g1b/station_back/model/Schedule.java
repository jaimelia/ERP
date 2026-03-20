package com.g1b.station_back.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Schedule {
    private java.time.LocalTime openingTime;
    private java.time.LocalTime closingTime;

    public Schedule() {}
    public Schedule(java.time.LocalTime openingTime, java.time.LocalTime closingTime) {
        this.openingTime = openingTime; this.closingTime = closingTime;
    }
    public java.time.LocalTime getOpeningTime() { return openingTime; }
    public void setOpeningTime(java.time.LocalTime openingTime) { this.openingTime = openingTime; }
    public java.time.LocalTime getClosingTime() { return closingTime; }
    public void setClosingTime(java.time.LocalTime closingTime) { this.closingTime = closingTime; }
}
