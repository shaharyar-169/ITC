import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap'
import "./Login.css";
import Resturant from '../../../image/Resturant.jpg';
import Malik from "../../../image/malik.png";
import Crystal from "../../../image/logo.png";
import itc from '../HomePage/itc.png'
import crystallogo from '../../../image/Crystal.jpeg';
import axios from "axios";
// import { useAuth } from "../../AuthContext"; // Adjust the path based on your project structure
import { ToastContainer, toast } from "react-toastify";
import Alert from "@mui/material/Alert";
import GRMETAL from '../../../image/grmetal.png';
import Metal from '../../../image/metal.jpg'
import { useTheme } from "../../../ThemeContext";


function Login() {
  const navigate = useNavigate();
  const userid = useRef();
  const password = useRef();
  const [logindata, setlogindata] = useState([]);
  const [alertData, setAlertData] = useState(null);
  // const { primaryColor, secondaryColor } = useTheme();

  console.log(logindata)


  const [userData, setUserData] = useState({
    userid: "",
    password: "",
    loading: false,
  });

  // const { isLoggedIn, userData, login } = useAuth();

  function UserLogin(event) {
   event.preventDefault();
    const data = {
      userid: userid.current.value,
      password: password.current.value,
    };
    const formData = new URLSearchParams(data).toString();


    axios
      .post("https://crystalsolutions.com.pk/iqbaltrader/loginweb.php", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setlogindata(response.data)
        if (response.data.error === 200) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user_id", JSON.stringify(response.data.user.id));
          // navigate("/MainPage");
          setAlertData({
            type: "success",
            message: `${response.data.message}`,
          });
          setTimeout(() => {
            setAlertData(null);
            navigate("/MainPage");
          }, 2000);
          // Display a success toast
          // toast.success("Login successful!", {
          //   position: toast.POSITION.TOP_CENTER,
          // });
        } else {
          console.log(response.data.message);

          setAlertData({
            type: "error",
            message: `${response.data.message}`,
          });
          setTimeout(() => {
            setAlertData(null);
          }, 2000);
        }
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
      });
  }

  return (
    <>
      {/* <div style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
      >
        {alertData && (
          <Alert
            severity={alertData.type}
            style={{
              position: "fixed",
              top: 0,
              left: 50,
              width: "30%",
              marginLeft: "40%",
              zIndex: 1000,
              textAlign: "center",
            }}
          >
            {alertData.message}
          </Alert>
        )}
        <div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div className="col-6 d-flex justify-content-center " >
            <div
              className="shadow"
              style={{
                border: '1px solid black ',
                borderRadius: '10px',
                width:'500px',
                height:'350px'
              }}
            >
              <div className="col" style={{ marginBottom: '50px', marginLeft: '20%' }}>
                <br />
                
                <div style={{ marginTop: '10px', marginBottom: '30px' }}>
                 <img
                  src={itc}
                  alt="Login"
                  style={{ marginLeft: "12%",  width: "20%" }}
                />
                  <span style={{
                    // marginLeft: '30%',
                    color: 'black',
                    fontSize: '30px',
                    fontWeight: '500',
                    fontFamily: 'arial',

                  }}> LOGIN</span>
                 
                </div>

                <div>
                  <input
                    type="text"
                    id="userid"
                    name="userid"
                    ref={userid}
                    style={{ width: "80%", padding: "2%",fontSize:'12px', fontFamily:'vardana', marginBottom: "2%", borderRadius: '30px', border: '2px solid #ccc' }}
                    placeholder="Enter ID"
                    required
                  />
                  <br />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    ref={password}
                    style={{ width: "80%", padding: "2%", fontSize:'12px', fontFamily:'vardana', marginBottom: "2%", borderRadius: '30px', border: '2px solid #ccc' }}
                    placeholder="Password"
                    required
                  />
                </div>


                <br />
                <button
                  style={{
                    backgroundColor: '#FF6600',
                    // border: `1px solid ${primaryColor}`,
                    width: "80%",
                    padding: "2%",
                    color: "white",
                    borderRadius: '30px',
                    border:'none'

                  }}
                  type="submit"
                  className="login-button"
                  disabled={userData.loading}
                  onClick={UserLogin}
                >
                  <span className="sign-in"> SIGN IN</span>
                </button>
                <br />
                <br />

              </div>
            </div>
          </div>
        </div>

        
      </div> */}



      <Container style={{ width: '100%', height: '100vh', display: "flex", alignItems: "center", justifyContent: 'center' }}>
     {alertData && (
        <Alert
          severity={alertData.type}
          style={{
            position: "fixed",
            top: 0,
            left: 50,
            // width: "30%",
            marginLeft: "40%",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          {alertData.message}
        </Alert>
)}
      
        <div id="form-bg-color" style={{ width: "40%", height: '75%', border: "1px solid #cccccc ", padding: "10px", display: 'flex', justifyContent: 'center' }}>
          <form onSubmit={UserLogin} style={{ width: '80%' }} >
            <div style={{ justifyContent: "center", display: "flex", flexDirection: 'column', alignItems: "center", fontSize: "12px", paddingBottom: '40px' }}>
              <div style={{ width: "30%" }}>
                <img src={itc} alt="Login" style={{ width: "100%" }} />
              </div>

              <div style={{ paddingLeft: "10px" }}>
                <span style={{ fontSize: '18px', color: "#1f2670", fontWeight: '500' }}>IQbal Trading Company</span>
              </div>
            </div>


            <div className="mb-3" style={{ fontSize: '14px' }}>
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input
                style={{ border: '1px solid #cccccc', fontSize: '14px' }}
                type="text"
                id="userid"
                name="userid"
                ref={userid}
                required
                className="form-control"
                aria-describedby="emailHelp"
                placeholder="Enter Id"
              />
            </div>
            <div className="mb-3" style={{ fontSize: '14px' }}>
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                ref={password}
                placeholder="Password"
                required
                style={{ border: '1px solid #cccccc', fontSize: '14px' }}
                className="form-control"

              />
            </div>

            <button
              type="submit"
              disabled={userData.loading}
              className="form-control "
              style={{ background: '#1f2670', color: "white" }}
            >Login</button>

            <div className="d-flex justify-content-center  flex-column" style={{ paddingTop: '30px', fontSize: '12px' }}>
              <div className="d-flex align-items-center ">
                <img
                  src={crystallogo}
                  alt="Login"
                  style={{ width: "30%" }}
                />

                {/* <span style={{ paddingLeft: '10px', fontSize:"12px" }}> Crystal Solution</span><br /> */}
              </div>


              <div className="d-flex align-items-center ">
                <span style={{fontSize:'12px'}} >+92 4235184078 +92 3044770075 <br/> E-mail: info@crystalsolutions.com.pk</span><br />
              </div>

            </div>
          </form>














        </div>

      </Container>




    </>
  );
}

export default Login;


