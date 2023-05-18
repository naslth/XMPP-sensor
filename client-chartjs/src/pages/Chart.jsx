import React, { useState, useEffect } from "react";
import "./Chart.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const Chart = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id !== "admin") {
        //get test
        try {
          const response = await axios.get(
            "http://localhost:8080/api/v1/sensors"
          );
          const filteredSensors = response.data.sensors;
          const sensorData = filteredSensors.filter((sensor) => {
            return !(sensor.id === "admin" && sensor.name === "Administrator");
          });

          const newDataList = sensorData.map((sensor) => {
            const dataIndex = dataList.findIndex(
              (item) => item.id === sensor.id
            );
            if (dataIndex !== -1) {
              const updatedData = { ...dataList[dataIndex] };
              for (const prop of sensor.props) {
                if (prop.key === "mem") {
                  updatedData.memory.push(prop.value || null);
                }
                if (prop.key === "temp") {
                  updatedData.temperature.push(prop.value || null);
                }
                if (prop.key === "humidity") {
                  updatedData.humidity.push(prop.value || null);
                }
                if (prop.key === "pressure") {
                  updatedData.pressure.push(prop.value || null);
                }
                if (prop.key === "windspeed") {
                  updatedData.windspeed.push(prop.value || null);
                }
                if (prop.key === "city") {
                  updatedData.city = prop.value || null;
                }
              }
              dataList[dataIndex] = updatedData;
              return updatedData;
            } else {
              const newData = {
                city: '',
                id: sensor.id,
                name: sensor.name,
                memory: [],
                temperature: [],
                humidity: [],
                pressure: [],
                windspeed: [],
              };
              for (const prop of sensor.props) {
                if (prop.key === "mem") {
                  newData.memory.push(prop.value || null);
                }
                if (prop.key === "temp") {
                  newData.temperature.push(prop.value || null);
                }
                if (prop.key === "humidity") {
                  newData.humidity.push(prop.value || null);
                }
                if (prop.key === "pressure") {
                  newData.pressure.push(prop.value || null);
                }
                if (prop.key === "windspeed") {
                  newData.windspeed.push(prop.value || null);
                }
                if (prop.key === "city") {
                  newData.city = prop.value || null;
                }
              }
              dataList.push(newData);
              return newData;
            }
          });

          setDataList(newDataList);
          console.log(newDataList);
        } catch (e) {
          console.log(e);
        }

        try {
          const response = await axios.get(`http://localhost:8080/api/v1/sensors/${id}`);
          const sensorData = response.data;

          const memoryProp = sensorData.props.find((prop) => prop.key === "mem");
          const temperatureProp = sensorData.props.find(
            (prop) => prop.key === "temp"
          );
          const humidityProp = sensorData.props.find(
            (prop) => prop.key === "humidity"
          );
          const pressureProp = sensorData.props.find(
            (prop) => prop.key === "pressure"
          );
          const windspeedProp = sensorData.props.find(
            (prop) => prop.key === "windspeed"
          );
          const cityProp = sensorData.props.find((prop) => prop.key === "city");
          setData((prevData) => {
            const newData = [...prevData];
            const existData = newData.find((item) => item.id === sensorData.id);
            if (existData) {
              existData.memory.push(memoryProp.value);
              existData.temperature.push(temperatureProp.value);
              existData.humidity.push(humidityProp.value);
              existData.pressure.push(pressureProp.value);
              existData.windspeed.push(windspeedProp.value);
              existData.city = cityProp.value;
            } else {
              newData.push({
                city: '',
                id: sensorData.id,
                name: sensorData.name,
                memory: [memoryProp.value],
                temperature: [temperatureProp.value],
                humidity: [humidityProp.value],
                pressure: [pressureProp.value],
                windspeed: [windspeedProp.value],
              });
            }
            return newData;
          })
        } catch (error) {
          console.log(error);
        }
      }
    };
    // fetchData();

    if (!data[id]) {
      fetchData();
    }

    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [id]);

  const userChartData =
    dataList.find((sensor) => {
      if (sensor.id === id) {
        console.log(sensor);
        return sensor;
      }
    }) || {};
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ fontFamily: "Mochiy Pop P one", marginBottom: "50px" }}>
        Current Weather Attributes in {userChartData.city} by {userChartData.name}
      </h1>
      <div className="Chart">
        <div>
          <LineChart
            width={700}
            height={400}
            // data={userChartData}
            data={
              Object.keys(userChartData).length !== 0
                ? userChartData.memory.map((memory, index) => ({ memory }))
                : userChartData
            }
            margin={{
              top: 5,
              right: 30,
              left: 80,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="memory"
              stroke="#e1251d"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          <div>Biểu đồ LineChart thể hiện lượng bộ nhớ sử dụng (MB)</div>
        </div>
        <div>
          <LineChart
            width={700}
            height={400}
            data={
              Object.keys(userChartData).length !== 0
                ? userChartData.temperature.map((temperature, index) => ({ temperature }))
                : userChartData
            }
            margin={{
              top: 5,
              right: 30,
              left: 80,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#76bd23"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          <div>Biểu đồ LineChart thể hiện nhiệt độ (°C)</div>
        </div>
        <div>
          <LineChart
            width={700}
            height={400}
            data={
              Object.keys(userChartData).length !== 0
                ? userChartData.humidity.map((humidity, index) => ({ humidity }))
                : userChartData
            }
            margin={{
              top: 5,
              right: 30,
              left: 80,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#d298d0"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          <div>Biểu đồ LineChart thể hiện độ ẩm (%)</div>
        </div>
        <div>
          <LineChart
            width={700}
            height={400}
            // data={userChartData}
            data={
              Object.keys(userChartData).length !== 0
                ? userChartData.pressure.map((pressure, index) => ({ pressure }))
                : userChartData
            }
            margin={{
              top: 5,
              right: 30,
              left: 80,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#00a2e1"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          <div>Biểu đồ LineChart thể hiện khí áp (mbar)</div>
        </div>
        <div>
          <LineChart
            width={700}
            height={400}
            // data={userChartData}
            data={
              Object.keys(userChartData).length !== 0
                ? userChartData.windspeed.map((windspeed, index) => ({ windspeed }))
                : userChartData
            }
            margin={{
              top: 5,
              right: 30,
              left: 80,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="windspeed"
              stroke="#ffc658"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          <div>Biểu đồ LineChart thể hiện thuộc tính tốc độ gió (m/s)</div>
        </div>
      </div>
      {/* <button onClick={handleClick}>Random</button> */}
    </div>
  );
};

export default Chart;
