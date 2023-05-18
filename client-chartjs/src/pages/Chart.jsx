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
          const sensorData = filteredSensors.filter(sensor => {
            return !(sensor.id === "admin" && sensor.name === "Administrator")
          });
          
          const newDataList = sensorData.map((sensor) => {
            const dataIndex = dataList.findIndex((item) => item.name === sensor.name);
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
              }
              dataList[dataIndex] = updatedData;
              return updatedData;
            } else {
              const newData = {
                name: sensor.name,
                memory: [],
                temperature: [],
                humidity: [],
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
              }
              dataList.push(newData);
              return newData;
            }
          });

          setDataList(newDataList);
          console.log(newDataList)
    
          } catch (e) {
            console.log(e)
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
          setData((prevData) => {
            const newData = [...prevData];
            const existData = newData.find((item) => item.name === sensorData.name);
            if (existData) {
              existData.memory.push(memoryProp.value);
              existData.temperature.push(temperatureProp.value);
              existData.humidity.push(humidityProp.value);
            } else {
              newData.push({
                name: sensorData.name,
                memory: [memoryProp.value],
                temperature: [temperatureProp.value],
                humidity: [humidityProp.value],
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

  const userChartData = data || {};

  // console.log(userChartData)

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ fontFamily: "Mochiy Pop P one", marginBottom: "50px" }}>
        Social Media Statistics of {userChartData.name}
      </h1>
      <div className="Chart">
      <div>
          <LineChart
            width={700}
            height={400}
            // data={userChartData}
            data={userChartData.length > 0 ? userChartData[0].memory.map((value, index) => ({value})) : userChartData}
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
              dataKey="value"
              stroke="#ffc658"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          <div>Biểu đồ LineChart thể hiện thuộc tính memory</div>
        </div>
        <div>
          <LineChart
            width={700}
            height={400}
            data={userChartData.length > 0 ? userChartData[0].temperature.map((value, index) => ({value})) : userChartData}
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
              dataKey="value"
              stroke="#ffc658"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          <div>Biểu đồ LineChart thể hiện thuộc tính temperature</div>
        </div>
        <div>
          <LineChart
            width={700}
            height={400}
            data={userChartData.length > 0 ? userChartData[0].humidity.map((value, index) => ({value})) : userChartData}
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
              dataKey="value"
              stroke="#ffc658"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          <div>Biểu đồ LineChart thể hiện thuộc tính humidity</div>
        </div>
      </div>
      {/* <button onClick={handleClick}>Random</button> */}
    </div>
  );
};

export default Chart;
