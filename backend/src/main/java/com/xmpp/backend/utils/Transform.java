package com.xmpp.backend.utils;

import java.util.ArrayList;
import java.util.List;

import org.igniterealtime.restclient.entity.UserEntities;
import org.igniterealtime.restclient.entity.UserEntity;
import org.igniterealtime.restclient.entity.UserProperty;

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
        for (SensorProperty property : sensor.getProps()) {
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
    public static UserEntity toNewUserEntity(UserEntity oldUser, Sensor newSensor) {
        UserEntity newUser = new UserEntity(newSensor.getId(), newSensor.getName(), newSensor.getId() + "@" + StaticResource.DOMAIN,
                newSensor.getId());
        List<UserProperty> userProperties = new ArrayList<UserProperty>();
        List<SensorProperty> sensorProperties = newSensor.getProps();
        for (SensorProperty property : sensorProperties) {
            userProperties.add(toUserProperty(property));
        }
        newUser.setProperties(userProperties);
        return newUser;
    }


}
