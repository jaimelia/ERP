package com.g1b.station_back.model;

import jakarta.persistence.*;

@Entity
@Table(name = "weekly_schedule")
public class WeeklySchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "openingTime", column = @Column(name = "monday_opening_time")),
            @AttributeOverride(name = "closingTime", column = @Column(name = "monday_closing_time"))
    })
    private Schedule monday;


    @Embedded private Schedule tuesday;
    @Embedded private Schedule wednesday;
    @Embedded private Schedule thursday;
    @Embedded private Schedule friday;
    @Embedded private Schedule saturday;
    @Embedded private Schedule sunday;

    public WeeklySchedule() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Schedule getMonday() {
        return monday;
    }

    public void setMonday(Schedule monday) {
        this.monday = monday;
    }

    public Schedule getTuesday() {
        return tuesday;
    }

    public void setTuesday(Schedule tuesday) {
        this.tuesday = tuesday;
    }

    public Schedule getWednesday() {
        return wednesday;
    }

    public void setWednesday(Schedule wednesday) {
        this.wednesday = wednesday;
    }

    public Schedule getThursday() {
        return thursday;
    }

    public void setThursday(Schedule thursday) {
        this.thursday = thursday;
    }

    public Schedule getFriday() {
        return friday;
    }

    public void setFriday(Schedule friday) {
        this.friday = friday;
    }

    public Schedule getSaturday() {
        return saturday;
    }

    public void setSaturday(Schedule saturday) {
        this.saturday = saturday;
    }

    public Schedule getSunday() {
        return sunday;
    }

    public void setSunday(Schedule sunday) {
        this.sunday = sunday;
    }
}
