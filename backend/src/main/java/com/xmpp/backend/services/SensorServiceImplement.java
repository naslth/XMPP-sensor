package com.xmpp.backend.services;

import org.springframework.stereotype.Service;
import com.xmpp.backend.model.Sensor;
import com.xmpp.backend.model.Sensors;
import com.xmpp.backend.utils.XmppApiPlugin;

@Service
public class SensorServiceImplement implements SensorService {
    public XmppApiPlugin plugin = new XmppApiPlugin();

    @Override
    public Sensors getAllSensors() {
        return plugin.getAllSensors();

    }

    @Override
    public Sensor getSensor(String id) {
        return plugin.getSensor(id);
    }

    @Override
    public Sensor createSensor(Sensor sensor) {
        return plugin.createSensor(sensor);
    }

    @Override
    public void deleteSensor(String id) {
        plugin.deleteSensor(id);
    }

    @Override
    public Sensor updateSensor(String id, Sensor newSensor) {
        return plugin.updateSensor(id, newSensor);
    }
}