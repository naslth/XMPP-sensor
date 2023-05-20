package com.xmpp.backend.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.annotation.PreDestroy;

import org.jivesoftware.smack.XMPPException;
import org.jivesoftware.smack.SmackException.NotConnectedException;
import org.jxmpp.stringprep.XmppStringprepException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.xmpp.backend.model.Sensor;
import com.xmpp.backend.model.SensorProperty;
import com.xmpp.backend.xmpp.XmppConfig;

@Component
public class GenerateSensorData {
    XmppApiPlugin xmppApiPlugin = new XmppApiPlugin();
    XmppConfig admin = new XmppConfig("admin", "9015");
    public static List<XmppConfig>  xmppSensors = new ArrayList<>();

    @Scheduled(initialDelay = 0, fixedDelay = Long.MAX_VALUE)
    public void connectXmpp() {
        List<Sensor> sensors = xmppApiPlugin.getAllSensors().getSensors();
        try {
            admin.connect();
            for (Sensor sensor : sensors) {
                if (sensor.getId().startsWith("sensor")) {
                    XmppConfig xmppSensor = new XmppConfig(sensor.getId(), sensor.getId());
                    xmppSensor.connect();
                    xmppSensors.add(xmppSensor);
                    xmppSensor.sensorListenMessage();
                }
            }
            admin.adminProcessMessage();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Scheduled(initialDelay = 30000, fixedRate = 60000)
    public void updateSensorData() {
        List<Sensor> sensors = xmppApiPlugin.getAllSensors().getSensors();
        System.out.println("_______________________________________________________________________________________");
        for (Sensor sensor : sensors) {
            if (sensor.getId().startsWith("sensor")) {
                List<SensorProperty> sensorProperties = sensor.getProps();
                int mem = 0;
                System.out.println(sensor.getId() + ": " + sensor.getName());
                for (SensorProperty property : sensorProperties) {
                    if (property.getKey().equals("mem")) {
                        mem = Integer.parseInt(property.getValue());
                        System.out.println("First memory: " + property.getValue());
                    }
                }
                for (SensorProperty property : sensorProperties) {
                    if (property.getKey().equals("city")) {
                        String city = property.getValue();
                        String weather = WeatherApiPlugin.getWeather(city);
                        List<SensorProperty> newProperties = Transform.toSensorProperties(weather);
                        Random r = new Random();
                        mem = r.nextInt((mem+100)-(mem-100)) + (mem-100);
                        newProperties.add(new SensorProperty("mem", Integer.toString(mem)));
                        System.out.println("After generated memory: " + mem);
                        sensor.setProps(newProperties);
                        xmppApiPlugin.updateSensor(sensor.getId(), sensor);
                    }
                }
                for (XmppConfig xmppSensor : xmppSensors) {
                    if (xmppSensor.getUserName().equals(sensor.getId())) {
                        // System.out.println(Integer.toString(mem) + " " + xmppSensor.getUserName() + "@"
                        //         + StaticResource.DOMAIN + " " + "admin@" + StaticResource.DOMAIN);
                        try {
                            xmppSensor.sensorSendMessage(Integer.toString(mem),
                                    xmppSensor.getUserName() + "@" + StaticResource.DOMAIN, "admin@" +
                                            StaticResource.DOMAIN);
                        } catch (NotConnectedException | XmppStringprepException | XMPPException e) {
                            e.printStackTrace();
                        }
                    }
                }
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("------------------------------");
            }
        }
        System.out.println("_______________________________________________________________________________________");
    }

    @PreDestroy
    public void destroy() {
        admin.disconnect();
        for (XmppConfig xmppSensor : xmppSensors) {
            xmppSensor.disconnect();
        }
        System.out.println("destroy");
    }
}
