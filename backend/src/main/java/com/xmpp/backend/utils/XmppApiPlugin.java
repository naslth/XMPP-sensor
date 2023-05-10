package com.xmpp.backend.utils;

import java.util.List;

import org.igniterealtime.restclient.RestApiClient;
import org.igniterealtime.restclient.entity.UserEntities;
import org.igniterealtime.restclient.entity.UserEntity;
import org.igniterealtime.restclient.enums.SupportedMediaType;

import com.xmpp.backend.exception.SensorAlreadyExsistsException;
import com.xmpp.backend.exception.SensorNotFoundException;
import com.xmpp.backend.model.Sensor;

import com.xmpp.backend.model.Sensors;

public class XmppApiPlugin {
    public RestApiClient restApiClient = new RestApiClient(StaticResource.DOMAIN, StaticResource.OPENFIREPORT,
            StaticResource.AUTHTOKEN);
    public RestApiClient restApiClientJson = new RestApiClient(StaticResource.DOMAIN, StaticResource.OPENFIREPORT,
            StaticResource.AUTHTOKEN, SupportedMediaType.JSON);

    boolean isUserExists(String id) {
        Sensors sensors = getAllSensors();
        List<Sensor> sensorsList = sensors.getSensors();
        boolean isExsist = false;
        for (Sensor sensor : sensorsList) {
            if (sensor.getId().equals(id)) {
                isExsist = true;
            }
        }
        return isExsist;
    }

    public Sensors getAllSensors() {
        UserEntities userEntities = restApiClient.getUsers();
        Sensors sensors = Transform.toSensors(userEntities);
        return sensors;
    }

    public Sensor getSensor(String id) {
        if (!isUserExists(id)) {
            return null;
        }
        UserEntity userEntity = restApiClient.getUser(id);
        Sensor sensor = Transform.toSensor(userEntity);
        return sensor;
    }

    public Sensor createSensor(Sensor sensor) {
        if(sensor == null) {
            throw new SensorNotFoundException("Sensor not found" );
        }
        String id = sensor.getId();
        if (isUserExists(id)) {
            // throw new SensorAlreadyExsistsException("Sensor already exists" );
            return null;
        }
        UserEntity userEntity = Transform.toUser(sensor);
            restApiClientJson.createUser(userEntity);
            return sensor;
    }

    public void deleteSensor(String id) {
        if (!isUserExists(id)) {
            throw new SensorNotFoundException("Sensor not found" );
        }
        restApiClient.deleteUser(id);
    }

    public Sensor updateSensor(String id, Sensor newSensor) {
        Sensor oldSensor = getSensor(id);
        if(oldSensor == null) {
            throw new SensorNotFoundException("Sensor not found" );
        } 
        UserEntity newUser = Transform.toUser(newSensor);
        restApiClientJson.updateUser(newUser);
        return newSensor;
    }
}
