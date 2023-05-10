package com.xmpp.backend.model;

import java.util.List;

// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;

public class Sensors {
    List<Sensor> sensors;

    public Sensors(List<Sensor> sensors) {
        this.sensors = sensors;
    }

    public Sensors() {
    }

    public List<Sensor> getSensors() {
        return sensors;
    }

    public void setSensors(List<Sensor> sensors) {
        this.sensors = sensors;
    }

    public void addSensor(Sensor sensor) {
        this.sensors.add(sensor);
    }

    public void removeSensor(Sensor sensor) {
        this.sensors.remove(sensor);
    }

    public void clearSensors() {
        this.sensors.clear();
    }

    public Sensor getSensor(int index) {
        return this.sensors.get(index);
    }

    public void setSensor(int index, Sensor sensor) {
        this.sensors.set(index, sensor);
    }

    public int size() {
        return this.sensors.size();
    }

    public boolean isEmpty() {
        return this.sensors.isEmpty();
    }

    public boolean contains(Object o) {
        return this.sensors.contains(o);
    }
}
