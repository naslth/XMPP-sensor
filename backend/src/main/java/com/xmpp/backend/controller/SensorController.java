package com.xmpp.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xmpp.backend.exception.SensorNotFoundException;
import com.xmpp.backend.model.Sensor;
import com.xmpp.backend.model.Sensors;
import com.xmpp.backend.services.SensorService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class SensorController {
    @Autowired
    private SensorService SensorService;

    @GetMapping("/sensors")
    public ResponseEntity<Sensors> getAllSensors() {
        try {
            Sensors sensors = SensorService.getAllSensors();
            if (sensors == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(sensors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/sensors/{id}")
    public ResponseEntity<Sensor> getSensor(@PathVariable String id) {
        try {
            Sensor sensor = SensorService.getSensor(id);
            if (sensor == null) {
                throw new SensorNotFoundException("Sensor not found");
            }
            return ResponseEntity.ok(sensor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/sensors")
    public ResponseEntity<Sensor> createSensor(@RequestBody Sensor sensor) {
        try {
            Sensor sensorCreated = SensorService.createSensor(sensor);
            if (sensorCreated == null) {
                throw new SensorNotFoundException("Sensor not found");
            }
            return ResponseEntity.ok(sensorCreated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();

        }
    }

    @DeleteMapping("/sensors/{id}")
    public ResponseEntity<String> deleteSensor(@PathVariable String id) {
        try {
            Sensor sensor = SensorService.getSensor(id);
            if (sensor == null) {
                throw new SensorNotFoundException("Sensor not found");
            }
            SensorService.deleteSensor(id);
            return ResponseEntity.ok("Deleted sensor");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/sensors/{id}")
    public ResponseEntity<Sensor> updateSensor(@PathVariable String id, @RequestBody Sensor newSensor) {
        try {
            Sensor sensorUpdated = SensorService.updateSensor(id, newSensor);
            if (sensorUpdated == null) {
                throw new SensorNotFoundException("Sensor not found");
            }
            return ResponseEntity.ok(sensorUpdated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
