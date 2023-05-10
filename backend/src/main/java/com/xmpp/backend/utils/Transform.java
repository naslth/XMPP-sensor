package com.xmpp.backend.utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.igniterealtime.restclient.entity.UserEntities;
import org.igniterealtime.restclient.entity.UserEntity;
import org.igniterealtime.restclient.entity.UserProperty;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xmpp.backend.model.Sensor;
import com.xmpp.backend.model.SensorProperty;
import com.xmpp.backend.model.Sensors;

public class Transform {
    public static UserProperty toUserProperty(SensorProperty sensorProperty) {
        UserProperty userProperty = new UserProperty();
        userProperty.setKey(sensorProperty.getKey());
        userProperty.setValue(sensorProperty.getValue());
        return userProperty;
    }

    public static SensorProperty toSensorProperty(UserProperty userProperty) {
        SensorProperty sensorProperty = new SensorProperty();
        sensorProperty.setKey(userProperty.getKey());
        sensorProperty.setValue(userProperty.getValue());
        return sensorProperty;
    }

    public static UserEntity toUser(Sensor sensor) {
        UserEntity user = new UserEntity(sensor.getId(), sensor.getName(), sensor.getId() + "@" + StaticResource.DOMAIN,
                sensor.getId());
        List<UserProperty> userProperties = new ArrayList<UserProperty>();
        userProperties.add(new UserProperty("temp",""));
        userProperties.add(new UserProperty("pressure",""));
        userProperties.add(new UserProperty("humidity",""));
        userProperties.add(new UserProperty("windspeed",""));
        List<SensorProperty> sensorProperties = sensor.getProps();
        for (SensorProperty property : sensorProperties) {
            userProperties.add(toUserProperty(property));
        }
        user.setProperties(userProperties);
        return user;
    }

    public static Sensor toSensor(UserEntity user) {
        List<SensorProperty> sensorProperties = new ArrayList<SensorProperty>();
        for (UserProperty property : user.getProperties()) {
            sensorProperties.add(toSensorProperty(property));
        }
        Sensor sensor = new Sensor(user.getUsername(), user.getName(), sensorProperties);
        return sensor;
    }

    public static Sensors toSensors(UserEntities userEntities) {
        List<Sensor> sensorsList = new ArrayList<Sensor>();
        for (UserEntity user : userEntities.getUsers()) {
            sensorsList.add(toSensor(user));
        }
        Sensors sensors = new Sensors(sensorsList);
        return sensors;
    }
    public static final List<SensorProperty> toSensorProperties(String weather) {
        List<SensorProperty> sensorProperties = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        try {
            Map<String, Object> map = mapper.readValue(weather, Map.class);
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                if (entry.getKey().equals("main")) {
                    Map<String, Object> main = mapper.convertValue(entry.getValue(), Map.class);
                    for (Map.Entry<String, Object> entry2 : main.entrySet()) {
                        if(entry2.getKey().equals("temp")){
                            String value = entry2.getValue().toString();
                            sensorProperties.add(new SensorProperty(entry2.getKey(), value));
                        }
                        if(entry2.getKey().equals("pressure")){
                            String value = entry2.getValue().toString();
                            sensorProperties.add(new SensorProperty(entry2.getKey(), value));
                        }
                        if(entry2.getKey().equals("humidity")){
                            String value = entry2.getValue().toString();  
                            sensorProperties.add(new SensorProperty(entry2.getKey(), value));
                        }
                    }
                }
                if(entry.getKey().equals("wind")) {
                    Map<String, Object> wind = mapper.convertValue(entry.getValue(), Map.class);
                    for (Map.Entry<String, Object> entry2 : wind.entrySet()) {
                        if(entry2.getKey().equals("speed")){
                            String value = entry2.getValue().toString();
                            sensorProperties.add(new SensorProperty(entry.getKey() + entry2.getKey(), value));
                        }
                    }
                }
            }
            return sensorProperties;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return sensorProperties;
    }

}
