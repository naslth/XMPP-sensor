package com.xmpp.backend.utils;

import java.util.List;
import java.util.Random;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.xmpp.backend.model.Sensor;
import com.xmpp.backend.model.SensorProperty;

@Component
public class GenerateSensorData {
    @Scheduled(fixedRate = 3000)
    public static final void updateSensorData() {
        XmppApiPlugin xmppApiPlugin = new XmppApiPlugin();
        List<Sensor> sensors = xmppApiPlugin.getAllSensors().getSensors();
        System.out.println("_______________________________________________________________________________________");
        for (Sensor sensor : sensors) {
            if (sensor.getId().startsWith("sensor")) {
                List<SensorProperty> sensorProperties = sensor.getProps();
                System.out.println(sensor.getId() + ": " + sensor.getName());
                for (SensorProperty property : sensorProperties) {
                    System.out.println(property.getKey() + ": " + property.getValue());
                    if (property.getKey().equals("city")) {
                        String city = property.getValue();
                        String weather = WeatherApiPlugin.getWeather(city);
                        List<SensorProperty> newProperties = Transform.toSensorProperties(weather);
                        Random r = new Random();
                        int mem = r.nextInt(1000-200) + 200;
                        newProperties.add(new SensorProperty("mem", Integer.toString(mem)));
                        sensor.setProps(newProperties);
                        xmppApiPlugin.updateSensor(sensor.getId(), sensor);
                    }
                }
                System.out.println("------------------------------");
            }
        }
        System.out.println("_______________________________________________________________________________________");
    }

}
