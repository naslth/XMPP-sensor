import React, { useState, useEffect } from "react";
import "./Chart.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Bar,
  LineChart,
  Line,
} from "recharts";

const Chart = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id !== "admin") {
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
          
  
          setData((prevData) => ({
            ...prevData,
            [id]: [
              {
                name: sensorData.name,
                memory: memoryProp.value,
                temperature: temperatureProp.value,
                humidity: humidityProp.value,
              },
            ],
          }));
        } catch (error) {
          console.log(error);
        }
      }
      
    };

    if (!data[id]) {
      fetchData();
    }

    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [id, data]);

  const userChartData = data[id] || [];
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
            data={userChartData}
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
            data={userChartData}
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
            data={userChartData}
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
