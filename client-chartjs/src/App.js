import React, { useState } from "react";
import "./App.css";
import {
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

const App = () => {
  const [data, setData] = useState([
    { name: "Facebook", users: 20 },
    { name: "Instagram", users: 15 },
    { name: "Twitter", users: 10 },
    { name: "Telegram", users: 5 },
  ]);

  const handleClick = () => {
    const newData = [...data];
    const randomUsers = Math.floor(Math.random() * 100) + 1;
    newData.push({ name: `Random ${newData.length + 1}`, users: randomUsers });
    setData(newData);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Social Media Users</h1>
      <div className="App">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="users"
            isAnimationActive={true}
            data={data}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
        <BarChart
          width={500}
          height={300}
          data={data}
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
          <Bar dataKey="users" fill="#8884d8" background={{ fill: "#eee" }} />
        </BarChart>

        <span>Line Chart</span>
        <LineChart
          width={500}
          height={300}
          data={data}
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
            dataKey="users"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
      <button onClick={handleClick}>Random</button>
    </div>
  );
};

export default App;
