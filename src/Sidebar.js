import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./menu.css";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Auth";

export default function Sidebar({ isVisible }) {
  const [menuData, setMenuData] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to manage sidebar visibility
  const navigate = useNavigate();
  // const { user, logout } = useAuth();

  // const handleLogout = () => {
  //   logout(); // Call the logout function to clear user authentication
  //   navigate("/emart"); // Redirect to the login page after logout
  // };

  const menuUrl =
    "https://crystalsolutions.com.pk/iqbaltrader/web/UserMenu.php";

  useEffect(() => {
    fetchMenuData();
  }, []);

  function fetchMenuData() {
    const data = {
      userid: 33,
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

      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }

  const customLinks = {
    "1-01-00":"/Get_Group",
    "1-05-00": "/Customer_Maintenance",
    "1-02-00": "/Get_Area",
    "1-03-00":'/Get_Collector',
    "1-04-00":'/Get_Verifier',
    "3-02-08": "/DailySaleReport",
    "3-02-07": "/DailyPurchaseReport",
    "3-02-05": "/DailyStockStatusReport",
    "3-03-05": "/SupplierLedgerReport",
    "3-03-06": "/CustomerLedgerReport",
    "3-01-01": "/PriceListReport",
    "3-01-02": "/CompanyListReport",
    "3-01-03": "/CategoryListReport",
    "3-01-07":"/ChartOfAccountList",
    "3-01-05":"/LocationList",
    "3-01-09":"/ItemListReport",
    "3-03-01":"/GeneralLegerReport",
    "3-03-03":"/ItemLegerReport",
    "3-04-04": "/ItempurchaseReport",
    "3-04-05": "/ItemsaleReport",
    "3-02-10": "/Cash&BankReport",
    "3-04-01":"/ItemStockReport",
    "3-01-11":"/EmployeeList",
    "3-04-02":"/ItemstatusReport",
    "3-04-07": "/ItemmarginReport",
    "3-04-08":"/SlowmovingReport"
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
    const sortedMiddleLevelKeys = Object.keys(middleLevelItems).sort((a, b) => {
      const middleDigitA = parseInt(a);
      const middleDigitB = parseInt(b);
      return middleDigitA - middleDigitB;
    });

    return sortedMiddleLevelKeys.map((middleLevel, index) => {
      const subSubItems = middleLevelItems[middleLevel].items;

      // Check if there are sub-sub-items
      if (subSubItems.length > 1) {
        // Filter out the first sub-sub-item
        const filteredSubSubItems = subSubItems.slice(1);

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
              {filteredSubSubItems.map((item, subIndex) => (
                <Dropdown.Item
                  key={subIndex}
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
      } else if (subSubItems.length === 1) {
        // If there's only 1 sub-sub-item, render it as a regular dropdown item
        return (
          <Dropdown.Item
            key={middleLevel}
            as={subSubItems[0].to !== "#" ? Link : undefined}
            to={subSubItems[0].to}
            disabled={subSubItems[0].disabled}
            className={`custom-dropdown-item${index === 0 ? ' hide-first-item' : ''}`}
          // Add the hide-first-item class to the first item
          >
            {middleLevelItems[middleLevel].label}
          </Dropdown.Item>
        );
      }

      // If there are no sub-sub-items, return null for that item
      return null;
    }).filter(Boolean); // Filter out null items

  };
  
  

  return (
    <div id="sidebar-menu" style={{ display: isVisible ? "block" : "none" }}>
      <Navbar
        style={{ backgroundColor: "var(--accent-color)" }}
        expand="lg"
        className="p-2 navbar-sidebar"
      >
        <Navbar.Brand href="/emart/dashboard"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="gap-2">
          <Nav className="mr-auto flex-column">
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
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}