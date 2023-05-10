package com.xmpp.backend.services;

import org.springframework.stereotype.Service;
import com.xmpp.backend.model.Sensor;
import com.xmpp.backend.model.Sensors;
import com.xmpp.backend.utils.XmppApiPlugin;

@Service
public interface SensorService {
    public XmppApiPlugin apiPlugin = new XmppApiPlugin();

    public Sensors getAllSensors();

    public Sensor getSensor(String id);

    public Sensor createSensor(Sensor sensor);

    public void deleteSensor(String id);

    public Sensor updateSensor(String id, Sensor newSensor);
}
