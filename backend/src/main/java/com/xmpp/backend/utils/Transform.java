package com.xmpp.backend.utils;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;

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

    public static UserEntity toCreateUser(Sensor sensor) {
        String id = "sensor" +sensor.getId();
        UserEntity user = new UserEntity(id, sensor.getName(), id + "@" + StaticResource.DOMAIN,
                id);
        List<UserProperty> userProperties = new ArrayList<UserProperty>();
        userProperties.add(new UserProperty("temp",""));
        userProperties.add(new UserProperty("pressure",""));
        userProperties.add(new UserProperty("humidity",""));
        userProperties.add(new UserProperty("windspeed",""));
        Date date = Calendar.getInstance().getTime();  
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");  
        String strDate = dateFormat.format(date);  
        userProperties.add(new UserProperty("timestamp",strDate));
        List<SensorProperty> sensorProperties = sensor.getProps();
        for (SensorProperty property : sensorProperties) {
            userProperties.add(toUserProperty(property));
        }
        user.setProperties(userProperties);
        return user;
    }
   public static UserEntity toUpdateUser(Sensor newSensor, UserEntity oldUser) {
        UserEntity user = new UserEntity(newSensor.getId(), newSensor.getName(), newSensor.getId() + "@" + StaticResource.DOMAIN,
        newSensor.getId());
        List<UserProperty> newUserProperties = oldUser.getProperties();
        List<SensorProperty> sensorProperties = newSensor.getProps();
        for (int i = 0; i < newUserProperties.size(); i++) {
            for (SensorProperty sensorProperty : sensorProperties) { 
                if (newUserProperties.get(i).getKey().equals(sensorProperty.getKey())) {
                    newUserProperties.get(i).setValue(sensorProperty.getValue());
                    break;
                }
            }
            if(newUserProperties.get(i).getKey().equals("timestamp")) {
                Date date = Calendar.getInstance().getTime();  
                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");  
                String strDate = dateFormat.format(date);
                newUserProperties.get(i).setValue(strDate);
            }
        }
        user.setProperties(newUserProperties);
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
            Random random = new Random();
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                if (entry.getKey().equals("main")) {
                    Map<String, Object> main = mapper.convertValue(entry.getValue(), Map.class);
                    for (Map.Entry<String, Object> entry2 : main.entrySet()) {
                        if(entry2.getKey().equals("temp")){
                            Double temp = (Double) entry2.getValue() - 273.15;
                            temp = (double)Math.round(((temp - 0.2567) + ((temp + 0.2567) - (temp-0.2567)) * random.nextDouble())*100)/100;
                            String value = temp.toString();
                            sensorProperties.add(new SensorProperty(entry2.getKey(), value));
                        }
                        if(entry2.getKey().equals("pressure")){
                            Integer pressure = (Integer) entry2.getValue();
                            pressure = random.nextInt((pressure+2)-(pressure-2)) + (pressure-2);
                            String value = pressure.toString();
                            sensorProperties.add(new SensorProperty(entry2.getKey(), value));
                        }
                        if(entry2.getKey().equals("humidity")){
                            Integer humidity = (Integer) entry2.getValue();
                            humidity = random.nextInt((humidity+1)-(humidity-1)) + (humidity-1);
                            if(humidity < 0){
                                humidity = 0;
                            }
                            if(humidity > 100){
                                humidity = 100;
                            }
                            String value = humidity.toString();
                            sensorProperties.add(new SensorProperty(entry2.getKey(), value));
                        }
                    }
                }
                if(entry.getKey().equals("wind")) {
                    Map<String, Object> wind = mapper.convertValue(entry.getValue(), Map.class);
                    for (Map.Entry<String, Object> entry2 : wind.entrySet()) {
                        if(entry2.getKey().equals("speed")){
                            Double windspeed = (Double) entry2.getValue();
                            windspeed = (double)Math.round(((windspeed - 0.2567) + ((windspeed + 0.2567) - (windspeed-0.2567)) * random.nextDouble())*100)/100;
                            String value = windspeed.toString();
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
