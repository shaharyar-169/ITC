import Cart from '../../../image/cart.png';
import logo from '../../../image/logo.png';
import itc from '../HomePage/itc.png';
import "../Header/Header.css";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from 'react-bootstrap';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../../ThemeContext';
import {
  Card,
  Row,
  Col,
  Button,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import axios from 'axios';
import { useData } from '../../../DataContext';

function Header({ id }) {
  const navigate = useNavigate();
  const { primaryColor, secondaryColor } = useTheme();
  const [getUser, setUser] = useState();
  const { apiLinks } = useTheme();
  // Define a state to handle the dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    // e.preventdefault();
    // Remove user data from local storage
    localStorage.removeItem("user_id");
    // Redirect to the login page
    navigate("/login");
  };
  useEffect(() => {
    // Retrieve user data from local storage
    const userData = JSON.parse(localStorage.getItem("user_id"));
    if (userData) {
      setUser(userData);
      console.log(userData);
      console.log("user id is", userData.userid); // Updated to access the 'id' property
    } else {
      // Handle cases when user data is not available
      console.error("User data not available in local storage.");
    }
  }, []);

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  ////////////CART ICON KA OPER ITEM NUMBER ///////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  const { orderData } = useData();


  useEffect(() => {
    // Retrieve user data from local storage
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
      setUser(userData);
      console.log(userData);
      // fetchMenuItems(userData.id); // Fetch menu items based on user ID from userData
      console.log("user id is", userData.id);
    } else {
      // Handle cases when user data is not available
      console.error("User data not available in local storage.");
    }
  }, []);
  const [totalItems, settotalItem] = useState([]);


  // useEffect(() => {
  //   fetch(`${apiLinks}/PendingOrder.php`)
  //     .then((response) => response.json())
  //     .then((apiData) => {
  //       const transformedData = apiData.map((item) => ({
  //           id : item.id,


  //       }));

  //       const columns = [
  //         { label: "Order ID", field: "id", sort: "asc" },

  //         { label: "Edit ", field: "tedtdat", sort: "asc" },


  //       ];

  //       // setData({ columns, rows: transformedData });

  //       settotalItem(apiData.length); 
  //     })
  //     .catch((error) => console.error(error));
  // }, []);
  const totalItem = totalItems; // Replace with your actual total item count

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={itc}
            alt="Company Logo"
            style={{ height: "50px", marginRight: "20px" }}
          />
          <h1 style={{ fontSize: "30px", margin: "0", color: primaryColor }}>
            Iqbal Trading Company
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>

          <h5 style={{ fontSize: "12px", margin: "0", marginLeft: "10px" }}>
            {moment().format("L")}a
          </h5>
          <div >

            <Dropdown>
              <Dropdown.Toggle variant="" id="dropdown-basic" style={{ border: 'none' }}>
                <FontAwesomeIcon className='text-dark' icon={faEllipsisV} />
              </Dropdown.Toggle>
              <Dropdown.Menu className='logout-menu'>
                <Dropdown.Item className='ancher-class' href="#">user</Dropdown.Item>
                <Dropdown.Item className='ancher-class' href="/login" onClick={handleLogout}>logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;






