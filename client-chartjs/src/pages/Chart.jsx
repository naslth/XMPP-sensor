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

  const { id } = useParams()
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`localhost:8080/api/v1/sensors/${id}`);
        const sensorData = response.data;
    
        const memoryProp = sensorData.props.find(prop => prop.key === "mem");
        const temperatureProp = sensorData.props.find(prop => prop.key === "temp");
        const humidityProp = sensorData.props.find(prop => prop.key === "humidity");
    
        setData(prevData => ({
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
    };

    if (!data[id]) {
      fetchData();
    }
  }, [id, data]);
 
  const userChartData = data[id] || [];
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ fontFamily: "Mochiy Pop P one", marginBottom: "50px" }}>
    Social Media Statistics of {userChartData.name}
      </h1>
      <div className="Chart">
        <div>
          <PieChart width={700} height={400}>
            <Pie
              dataKey="memory"
              isAnimationActive={true}
              data={userChartData}
              cx={350}
              cy={200}
              outerRadius={100}
              fill="#8884d8"
              label
            />
            <Tooltip />
            <Legend />
          </PieChart>
          <div>Biểu đồ PieChart thể hiện thuộc tính memory</div>
        </div>
        <div className="BarChar">
          {" "}
          <BarChart
            width={700}
            height={400}
            data={userChartData}
            margin={{
              top: 5,
              right: 30,
              left: 80,
              bottom: 5,
            }}
            barSize={20}
          >
            <XAxis
              dataKey="name"
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar
              dataKey="temperature"
              fill="#82ca9d"
              background={{ fill: "#eee" }}
            />
          </BarChart>
          <div>Biểu đồ BarChart thể hiện thuộc tính temperature</div>
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
        <div>
          <AreaChart
      width={700}
      height={400}
      data={userChartData}
      margin={{
        top: 5,
        right: 30,
        left: 80,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="temperature" stroke="#8884d8" fill="#8884d8" stackId="1" />
      <Area
        type="monotone"
        dataKey="humidity"
        stackId="1"
        stroke="#82ca9d"
        fill="#82ca9d"
      />
         <Legend />
    </AreaChart>
    <div>Biểu đồ AreaChart thể hiện tương quan giữa temperature và humidity</div>
          </div>
      </div>
      {/* <button onClick={handleClick}>Random</button> */}
    </div>
  );
};

export default Chart;
