package com.g1b.station_back.model;

import jakarta.persistence.*;

@Entity
@Table(name = "weekly_schedule")
public class WeeklySchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_weekly_schedule")
    private Integer id;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "openingTime", column = @Column(name = "monday_opening_time")),
            @AttributeOverride(name = "closingTime", column = @Column(name = "monday_closing_time"))
    })
    private Schedule monday;


    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "openingTime", column = @Column(name = "tuesday_opening_time")),
            @AttributeOverride(name = "closingTime", column = @Column(name = "tuesday_closing_time"))
    })
    private Schedule tuesday;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "openingTime", column = @Column(name = "wednesday_opening_time")),
            @AttributeOverride(name = "closingTime", column = @Column(name = "wednesday_closing_time"))
    })
    private Schedule wednesday;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "openingTime", column = @Column(name = "thursday_opening_time")),
            @AttributeOverride(name = "closingTime", column = @Column(name = "thursday_closing_time"))
    })
    private Schedule thursday;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "openingTime", column = @Column(name = "friday_opening_time")),
            @AttributeOverride(name = "closingTime", column = @Column(name = "friday_closing_time"))
    })
    private Schedule friday;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "openingTime", column = @Column(name = "saturday_opening_time")),
            @AttributeOverride(name = "closingTime", column = @Column(name = "saturday_closing_time"))
    })
    private Schedule saturday;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "openingTime", column = @Column(name = "sunday_opening_time")),
            @AttributeOverride(name = "closingTime", column = @Column(name = "sunday_closing_time"))
    })
    private Schedule sunday;

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
