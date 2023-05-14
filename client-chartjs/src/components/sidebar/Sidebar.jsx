import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import "./sidebar.scss";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSensorData, setNewSensorData] = useState({
    id: "",
    name: "",
    memory: "",
    temperature: "",
    humidity: "",
  });
  const openModal = () => {
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sensorData = {
      id: newSensorData.id,
      name: newSensorData.name,
      props: [
        { key: "mem", value: newSensorData.memory },
        { key: "temp", value: newSensorData.temperature },
        { key: "humidity", value: newSensorData.humidity },
      ],
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/sensors",
        sensorData
      );
      if (response.status === 201) {
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
        const sensors = response.data;
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
        <form className="modal__form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="id"
            value={newSensorData.id}
            onChange={handleNewSensorDataChange}
            placeholder="ID"
          />
          <input
            type="text"
            name="name"
            value={newSensorData.name}
            onChange={handleNewSensorDataChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="memory"
            value={newSensorData.memory}
            onChange={handleNewSensorDataChange}
            placeholder="Memory"
          />
          <input
            type="text"
            name="temperature"
            value={newSensorData.temperature}
            onChange={handleNewSensorDataChange}
            placeholder="Temperature"
          />
          <input
            type="text"
            name="humidity"
            value={newSensorData.humidity}
            onChange={handleNewSensorDataChange}
            placeholder="Humidity"
          />
          <div class="button-group">
            <button type="submit">Add</button>
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
