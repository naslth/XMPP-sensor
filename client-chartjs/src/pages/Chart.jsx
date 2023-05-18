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
          
  
          // setData((prevData) => ({
          //   ...prevData,
          //   [id]: [
          //     {
          //       name: sensorData.name,
          //       memory: memoryProp.value,
          //       temperature: temperatureProp.value,
          //       humidity: humidityProp.value,
          //     },
          //   ],
          // }));
          
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
          
          // setData((prevData) => {
          //   const newData = [...prevData];
          //   const existData = newData.find((item) => item.name === sensorData.name);
          //   if (existData) {
          //     existData.memory.push(memoryProp.value);
          //     existData.temperature.push(temperatureProp.value);
          //     existData.humidity.push(humidityProp.value);
          //   } else {
          //     newData.push({
          //                   name: sensorData.name,
          //       memory: [memoryProp.value],
          //       temperature: [temperatureProp.value],
          //       humidity: [humidityProp.value],
          //     });
          //   }
          //   return newData;
          // })
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
  // const test = data.find((item) => item.name === id || {}) 
  // const {name, memory = [], temperature = [], humidity = []} = test;
  console.log(userChartData)
  // console.log(userChartData[0].memory)
  // console.log(test)
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
