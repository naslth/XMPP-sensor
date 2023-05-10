import React, { useState } from "react";
import "./ListSensor.scss";

const ListSensor = () => {
  const [sensorName, setSensorName] = useState([
    { name: "sensor1" },
    { name: "sensor2" },
    { name: "sensor3" },
    { name: "sensor4" },
    { name: "sensor5" },
    { name: "sensor6" },
    { name: "sensor7" },
    { name: "sensor8" },
    { name: "sensor9" },
    { name: "sensor10" },
  ]);
  return (
    <div className="list-sensor">
      <h3>Danh sách các sensor</h3>
      <div>
        <table className="table-list-sensor">
          {sensorName.map((sensor, index) => {
            return (
              <tr key={index}>
                <td className="td-sensor">{sensor.name}</td>
                <td className="td-sensor">
                  <button>Delete</button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
      <div>
        <button>Create</button>
      </div>
    </div>
  );
};
export default ListSensor;
