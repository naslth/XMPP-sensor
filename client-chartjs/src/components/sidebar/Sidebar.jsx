import React from 'react'
import ReactDOM from 'react-dom'

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import "./sidebar.scss";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeCheck, setIsChangeCheck] = useState(false);
  const [newSensorData, setNewSensorData] = useState({
    id: "",
    name: "",
    memory: "",
    city: "",
  });
  const [changeSensorDataId, setChangeSensorDataId] = useState()
  const [changeSensorDataName, setChangeSensorDataName] = useState()
  const [changeSensorDataCity, setChangeSensorDataCity] = useState()

  const openModal = () => {
    setIsChangeCheck(false)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNewSensorDataChange = (e) => {
    const { name, value } = e.target;
    setNewSensorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeId = (e) => {
    setChangeSensorDataId(e.target.value)
  }
  const handleChangeName = (e) => {
    setChangeSensorDataName(e.target.value)
  }
  const handleChangeCity = (e) => {
    setChangeSensorDataCity(e.target.value)
  }

  const handleSubmitChange = async (e) => {
    e.preventDefault();
    const sensorUpdate = {
      id: changeSensorDataId,
      name: changeSensorDataName,
      props: [
        { key: "city", value: changeSensorDataCity },
        { key: "mem", value: "500" }
      ]
    }
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/sensors/${changeSensorDataId}`, sensorUpdate);
      closeModal();
        window.location.reload(false);
    } catch (error) {
      console.log(error);
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sensorData = {
      id: newSensorData.id,
      name: newSensorData.name,
      props: [
        { key: "city", value: newSensorData.city },
        { key: "mem", value: "500" },
        
      ],
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/sensors",
        sensorData
      );
      if (response.status === 200) {
        console.log("Sensor đã được thêm thành công!");
        // Thực hiện các thao tác cần thiết sau khi thêm thành công
        // Thực hiện các thao tác cần thiết sau khi thêm thành công
        const newItem = {
          display: newSensorData.name,
          icon: <i className="bx bx-user"></i>,
          to: `/user/${newSensorData.id}`,
          section: `user/${newSensorData.id}`,
        };
        setSidebarNavItems((prevItems) => [...prevItems, newItem]);
        closeModal();
        window.location.reload(false);
      } else {
        console.log("Đã xảy ra lỗi khi thêm sensor.");
      }
    } catch (error) {
      console.log("Đã xảy ra lỗi khi thêm sensor:", error);
    }
  };
  const [sidebarNavItems, setSidebarNavItems] = useState([]);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/sensors"
        );
        const filteredSensors = response.data.sensors;
        const sensors = filteredSensors.filter(sensor => {
          return !(sensor.id === "admin" && sensor.name === "Administrator")
        });
        const navItems = sensors.map((sensor) => ({
          id: sensor.id,
          display: sensor.name,
          icon: <i className="bx bx-user"></i>,
          to: `/user/${sensor.id}`,
          section: `user/${sensor.id}`,
        }));
        setSidebarNavItems(navItems);
      } catch (error) {
        console.log("Error fetching sensors:", error);
      }
    };

    fetchSensors();
  }, []);

  const removeSidebarNavItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/sensors/${id}`);
      setSidebarNavItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );
      console.log(`Sensor with ID ${id} has been deleted.`);
    } catch (error) {
      console.log(`Error deleting sensor with ID ${id}:`, error);
    }
  };
  const changeSidebarNavItem= async (idItem) => {
    setIsModalOpen(true);
    setIsChangeCheck(true)
   
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/sensors/${idItem}`);
      const sensorData = response.data;
      
      setChangeSensorDataId(sensorData.id)
      setChangeSensorDataName(sensorData.name)
      const cityCheck = sensorData.props.find(
        (prop) => prop.key === "city"
      );
      setChangeSensorDataCity(cityCheck.value)
      // console.log(sensorData.id, sensorData.name, cityCheck.value)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        Sensor
        <button onClick={openModal}>Add</button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Sensor Modal"
        className="modal"
      >
        <h2 className="modal__title">Add Sensor</h2>
        <form className="modal__form" onSubmit={isChangeCheck ? handleSubmitChange : handleSubmit}>
          <input
            type="text"
            name="id"
            value={isChangeCheck ? changeSensorDataId : newSensorData.id}
            onChange={isChangeCheck ? handleChangeId : handleNewSensorDataChange}
            placeholder="ID"
            disabled={isChangeCheck}
          />
          <input
            type="text"
            name="name"
            value={isChangeCheck ? changeSensorDataName : newSensorData.name}
            onChange={isChangeCheck ? handleChangeName : handleNewSensorDataChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="city"
            value={isChangeCheck ? changeSensorDataCity : newSensorData.city}
            onChange={isChangeCheck ? handleChangeCity : handleNewSensorDataChange}
            placeholder="City"
          />
          
          <div class="button-group">
            <button type="submit">{isChangeCheck ? "Change" : "Add"}</button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <div className="sidebar__menu">
        {sidebarNavItems.map((item, index) => (
          <Link to={item.to} key={index}>
            <div className={`sidebar__menu__item`}>
              <div className="sidebar__menu__item__icon">{item.icon}</div>
              <div className="sidebar__menu__item__text">{item.display}</div>
            </div>
            <button
              className="btn btn-delete"
              onClick={() => removeSidebarNavItem(item.id)}
            >
              Delete
            </button>
            <button
              className="btn btn-delete"
              onClick={() => changeSidebarNavItem(item.id)}
            >
              Change
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
