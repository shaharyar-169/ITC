import { React, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import NavBar from "../Navbar/Navbar";
import Header from "../Header/Header";
import itc from './itc.png'
// import Ittefaq from "../../image/logo.png";
// import Ittefaq from '../../../image/logo.png';
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";
// import SideBar from "../SideBar/SideBar";
// import Metal from '../../../image/grmetal.png';
// import Malik from '../../../image/malik.png'
import Menu from "../../../Menu";

import '../../../menu.css'
import { useTheme } from "../../../ThemeContext";
import './Homepage.css'
function HomePage1() {
  const location = useLocation();
  const { primaryColor, secondaryColor } = useTheme();
  const [showNavBar, setShowNavBar] = useState(true);

  const toggleNavbar = () => {
    setShowNavBar(!showNavBar);
  };
  const userid = location?.state?.userid || null; // Check if location state contains the userid
  const permissions = location?.state?.permissions || [];

  return (
    <>

      {/* {showNavBar && <SideBar />}   
      {!showNavBar && <Header />}  
      {!showNavBar && <NavBar />}    */}

      {/* <div  >

        <button onClick={toggleNavbar} className="buttondesign" style={{backgroundColor:primaryColor,color:secondaryColor}}>
        {showNavBar ?'hide sidebar' : 'show navbar'}
    </button>

    </div> */}

      <Header />
      {/* <NavBar /> */}
      <Menu />

      <Container className="d-flex justify-content-center align-items-center" style={{ backgroundColor: "lightblack", marginTop:'50px' }}>
        <Row className="containter-fluid d-flex flex-column justify-content-center align-items-center" >
          <Col className="col-lg-12 col-md-12 d-flex flex-column justify-content-center align-items-center">
            <img
              src={itc}
              alt="ITTEFAQ ELECTRONICS"
              style={{ width: "35%", color: "red" }}
            />
            <h1
              className="mt-4 mb-5"
              style={{ color: primaryColor, fontSize: "48px", fontWeight: "bold" }}
            >
              Welcome to IQbal Trader
            </h1>
          </Col>
        </Row>
      </Container>

      {/* <div
        className="d-flex flex-column flex-grow-1"
        style={{ backgroundColor: "lightblack" }}
      >

        <div className="container-fluid HomePage1 row justify-content-center align-items-center">


          <div className="col-8 col-md-8 col-lg-8 text-center" style={{ marginTop: '3%' }}>

            <img
              src={itc}
              alt="ITTEFAQ ELECTRONICS"
              style={{ width: "35%", color: "red" }}
            />
            <h1
              className="mt-4 mb-5"
              style={{ color: primaryColor, fontSize: "48px", fontWeight: "bold" }}
            >
              Welcome to IQbal Trader
            </h1>
            
          </div>

        </div>

      </div> */}

      <Footer className="mt-auto fixed-bottom" />
    </>
  );
}

export default HomePage1;
