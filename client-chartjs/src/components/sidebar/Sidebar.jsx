import { useEffect, useRef, useState } from "react";
import { Link, useLocation,  useNavigate } from "react-router-dom";
import "./sidebar.scss";

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sidebarRef = useRef();
  const location = useLocation();
  const [count, setCount] = useState(0);
  const [sidebarNavItems, setSidebarNavItems] = useState([
    {
      display: "User",
      icon: <i className="bx bx-user"></i>,
      to: "/calendar",
      section: "user",
    },
  ]);

  // useEffect(() => {
  //     setTimeout(() => {
  //         const sidebarItem = sidebarRef.current.querySelector('.sidebar__menu__item');
  //         indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
  //         setStepHeight(sidebarItem.clientHeight);
  //     }, 50);
  // }, []);

  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = sidebarNavItems.findIndex(
      (item) => item.section === curPath
    );
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  const addSidebarNavItem = (newItem) => {
    setSidebarNavItems((prevItems) => [...prevItems, newItem]);
  };
  const navigate = useNavigate();
    const handleAddNavItem = () => {
        const newItem = {
          display: `User ${count + 1} `,
          icon: <i className="bx bx-user"></i>,
          to: `/user/${count + 1}`, // Update the route path
          section: `user/${count + 1}`, // Update the section identifier
        };
        setCount(count + 1);
        addSidebarNavItem(newItem);
        navigate(`/user/${count + 1}`); // Navigate to the newly added user route
      };
  

  const removeSidebarNavItem = (index) => {
    setSidebarNavItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        Sensors
        <button onClick={handleAddNavItem}>
          <i className="add">Add</i>
        </button>
      </div>

      <div ref={sidebarRef} className="sidebar__menu">
        {sidebarNavItems.map((item, index) => (
          <Link to={item.to} key={index}>
            <div className={`sidebar__menu__item ${activeIndex}`}>
              <div className="sidebar__menu__item__icon">{item.icon}</div>
              <div className="sidebar__menu__item__text">{item.display}</div>
              <button
                class="btn btn-delete"
                onClick={() => removeSidebarNavItem(index)}
              >
                <span class="mdi mdi-delete mdi-24px"></span>
                <span class="mdi mdi-delete-empty mdi-24px"></span>
                <span>X</span>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
