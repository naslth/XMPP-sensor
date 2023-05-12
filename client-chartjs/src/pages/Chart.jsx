import React, { useState, useEffect } from "react";
import "./Chart.css";
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
  console.log(id);

  const [count, setCount] = useState(0);
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("chartData");
    return savedData ? JSON.parse(savedData) : {};
  });

  useEffect(() => {
    // Lưu dữ liệu biểu đồ vào localStorage
    localStorage.setItem("chartData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!data[id]) {
      // Khởi tạo dữ liệu biểu đồ cho ID người dùng chưa có dữ liệu
      setData((prevData) => ({
        ...prevData,
        [id]: [
          { name: "Facebook", memory: 4, temperature: 25, humidity: 60 },
          { name: "Instagram", memory: 8, temperature: 28, humidity: 70 },
          { name: "Twitter", memory: 6, temperature: 30, humidity: 55 },
          { name: "Telegram", memory: 2, temperature: 22, humidity: 75 },
        ],
      }));
    }
  }, [id]);

  const updateData = () => {
    setData((prevData) => {
      const newData = { ...prevData };
      const currentData = newData[id] || [];

      let updatedData = [];
      if (currentData.length >= 10) {
        updatedData = currentData.slice(1); // Xóa phần tử đầu tiên của mảng
      } else {
        updatedData = [...currentData];
      }
      const randomMemory = Math.floor(Math.random() * 8) + 1;
      const randomTemperature = Math.floor(Math.random() * 10) + 20;
      const randomHumidity = Math.floor(Math.random() * 30) + 50;
      updatedData.push({
        name: `Random ${count + 1}`,
        memory: randomMemory,
        temperature: randomTemperature,
        humidity: randomHumidity,
      });

      newData[id] = updatedData;
      return newData;
    });

    setCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [count, id]);

  const userChartData = data[id] || [];
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ fontFamily: "Mochiy Pop P one", marginBottom: "50px" }}>
        Social Media Statistics
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
