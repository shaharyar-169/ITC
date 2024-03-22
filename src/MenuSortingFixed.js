import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { useAuth } from "../Auth";
import Sidebar from "./Sidebar";
import DateDisplay from "./DateDisplay";

export default function Menu() {
  const [menuData, setMenuData] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to manage sidebar visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve userData from local storage
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
    }
  }, []);

  const menuUrl =
    "https://crystalsolutions.com.pk/emart/web/get_usrmenu.php";

  useEffect(() => {
    fetchMenuData();
  }, []);

  function fetchMenuData() {
    const data = {
      userid: 74,
    };
    const formData = new URLSearchParams(data).toString();

    axios
      .post(menuUrl, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setMenuData(response.data);
        console.log("Menu Data:", response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }

  const customLinks = {
    "1-01-00": "/store",
    "3-01-02": "/company",
    "4-26-00": "/capacity",
    "4-06-00": "/type",
    "3-01-03": "/category",
    "3-01-11": "/employee-list",
    "3-01-09": "/item",
    "4-03-00": "/user-list",
    "3-02-08": "/daily-sale",
    "4-10-00": "/daily-sale-detail",
    "4-14-00": "/monthly-cash-sale/",
    "4-15-00": "/monthly-credit-sale/",
    "4-19-00": "/monthly-total-sale/",
  };

  const nestedMenu = menuData.reduce((menu, item) => {
    const [topLevel, subMenu] = item.tmencod.split("-");
    if (!menu[topLevel]) {
      menu[topLevel] = {
        label: item.tmendsc,
        items: [],
      };
    }
    // Skip the first item in each dropdown
    if (subMenu !== "00") {
      menu[topLevel].items.push({
        label: item.tmendsc,
        to: customLinks[item.tmencod] || "#",
        disabled: item.tmenprm === "N",
      });
    }
    return menu;
  }, {});

  const toggleSidebar = () => {
    console.log("Toggle sidebar clicked");
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Sort the menuData array based on tmencod
  menuData.sort((a, b) => a.tmencod.localeCompare(b.tmencod));

  // Initialize an empty object to store the hierarchical menu data
  const hierarchicalMenuData = {};

  // Loop through the sorted menuData array
  menuData.forEach((item) => {
    const [topLevel, middleLevel, subLevel] = item.tmencod.split("-");

    // Create the top-level menu item if it doesn't exist
    if (!hierarchicalMenuData[topLevel]) {
      hierarchicalMenuData[topLevel] = {
        label: item.tmendsc,
        items: [],
      };
    }

    // Create the middle-level menu item if it doesn't exist
    if (!hierarchicalMenuData[topLevel].items[middleLevel]) {
      hierarchicalMenuData[topLevel].items[middleLevel] = {
        label: item.tmendsc,
        items: [],
      };
    }

    // Add the sub-level menu item
    hierarchicalMenuData[topLevel].items[middleLevel].items.push({
      label: item.tmendsc,
      to: customLinks[item.tmencod] || "#",
      disabled: item.tmenprm === "N",
    });
  });

  const renderSubSubDropdown = (topLevel) => {
  const middleLevelItems = hierarchicalMenuData[topLevel].items;

  // Sort middle level keys based on the middle digit of tmencod
  const sortedMiddleLevelKeys = Object.keys(middleLevelItems).sort(
    (a, b) => {
      const middleDigitA = parseInt(a);
      const middleDigitB = parseInt(b);
      return middleDigitA - middleDigitB;
    }
  );

  return sortedMiddleLevelKeys.map((middleLevel) => {
    const subSubItems = middleLevelItems[middleLevel].items;

    // Check if there are sub-sub-items
    if (subSubItems.length > 0) {
      return (
        <Dropdown key={middleLevel} className="custom-dropdown-button dropend">
          <Dropdown.Toggle
            variant="transparent"
            id={`dropdown-${topLevel}-${middleLevel}`}
            className="sub-dropdown-toggle"
          >
            {middleLevelItems[middleLevel].label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {subSubItems.map((item, index) => (
              <Dropdown.Item
                key={index}
                as={item.to !== "#" ? Link : undefined}
                to={item.to}
                disabled={item.disabled}
                className="sub-dropdown-item"
              >
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      );
    } else {
      // If there are no sub-sub-items, render the middle-level item as a regular dropdown item
      return (
        <Dropdown.Item
          key={middleLevel}
          as={middleLevelItems[middleLevel].items[0].to !== "#" ? Link : undefined}
          to={middleLevelItems[middleLevel].items[0].to}
          disabled={middleLevelItems[middleLevel].items[0].disabled}
          className="custom-dropdown-item"
        >
          {middleLevelItems[middleLevel].label}
        </Dropdown.Item>
      );
    }
  });
};

  return (
    <>
      <Navbar
        style={{ backgroundColor: "var(--secondary-color)" }}
        expand="lg"
        className="p-2"
      >
        <Navbar.Brand href="/emart/dashboard"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="gap-2 d-flex justify-content-between"
        >
          <Nav className="mr-auto">
            {Object.keys(hierarchicalMenuData).map((topLevel) => (
              <Dropdown key={topLevel} className="custom-dropdown-button">
                <Dropdown.Toggle
                  variant="transparent"
                  id={`dropdown-${topLevel}`}
                >
                  {hierarchicalMenuData[topLevel].label}
                </Dropdown.Toggle>
                <Dropdown.Menu>{renderSubSubDropdown(topLevel)}</Dropdown.Menu>
              </Dropdown>
            ))}
          </Nav>
          <div className="gap-2 d-flex align-items-center flex-row">
            <Button
              variant="danger"
              className="d-flex justify-self-end"
            >
              Logout
            </Button>
            <Button onClick={toggleSidebar} variant="secondary">
              Sidebar
            </Button>
          </div>
        </Navbar.Collapse>
      </Navbar>
      <Sidebar isVisible={isSidebarVisible} />
    </>
  );
}
