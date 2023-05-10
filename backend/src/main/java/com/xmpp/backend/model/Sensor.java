package com.xmpp.backend.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Sensor {
    private String id;
    private String name;
    private List<SensorProperty> props;

    public Sensor() {
    }

    @JsonCreator
    public Sensor(@JsonProperty("id") String id, @JsonProperty("name") String name,
            @JsonProperty("props") List<SensorProperty> props) {
        this.id = id;
        this.name = name;
        this.props = props;
    }

    @Override
    public String toString() {
        return "Sensor [id=" + id + ", name=" + name + ", props=" + props + "]";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SensorProperty> getProps() {
        return props;
    }

    public void setProps(List<SensorProperty> props) {
        this.props = props;
    }

}