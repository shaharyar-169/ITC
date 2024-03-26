import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../../MainComponent/Header/Header";
// import "./Add_Category.css";
import React, { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Footer from "../../MainComponent/Footer/Footer";

function Add_Area() {
  const [values, setValues] = useState({
    AreDscc: "",
    AreStss: "",
    loading: false,
  });
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [alertData, setAlertData] = useState(null);
  const [alert, setAlert] = useState(null);
  const primaryColor = "#c90b13";
  const secondaryColor = "white";
  const fontFamily = "verdana";
  const apiLinks = "https://crystalsolutions.com.pk/iqbaltrader/web/";
 // Create refs for each input field
 const ENTER1 = useRef(null);
 const ENTER2 = useRef(null);
 const ENTER3 = useRef(null);
 const ENTER4 = useRef(null);
  const handleInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const value = {
      AreStss: selectedStatus,
    };
    

    setValues((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const formData = new FormData();
      formData.append("AreDsc", ENTER1.current.value);
      formData.append("AreSts", value.AreStss);
        console.log(values.AreDscc,ENTER1.current.value )
      axios
        .post(`${apiLinks}/AddArea.php`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        // .then((res) => {
        //   console.log(res);
        // });
        .then((response) => {
          if (response.data.error === 200) {
            setAlertData({
              type: "success",
              message: `${response.data.message}`,
            });
            setTimeout(() => {
              setAlertData(null);
              navigate("/Get_Area");
            }, 3000);
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

      // Reset form values after submission
      setValues({
        FCtgDscc: "",
        FCtgStss: "",
        loading: false,
      });

      setAlert("Image uploaded successfully.");
    } catch (error) {
      setAlert("Error uploading image.");
      console.error(error);
    } finally {
      setValues((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  //////////////////////// PRESS ENTER TO MOVE THE NEXT FIELD //////////////////

 

  // Function to focus on the next input field
  const focusNextInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  // Function to handle Enter key press
  const handleEnterKeyPress = (ref, e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter key press
      focusNextInput(ref);
    }
  };
  return (
    <>
      <div
        style={{
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
              left: 0,
              width: "30%",
              marginLeft: "35%",
              zIndex: 1000,
              textAlign: "center",
            }}
          >
            {alertData.message}
          </Alert>
        )}
        <Header />

      

        <div
          className="col-12"
          style={{ color: "black", fontWeight: "bold", fontFamily: fontFamily }}
        >
          <div
            className="row"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "5px",
              backgroundColor: "#f5f5f5",
              minHeight: "100vh",
            }}
          >
            <div
              className="col-md-12 form-container"
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                padding: "10px",
                width: "100%",
                maxWidth: "500px",
                margin: "20px 0",
                fontSize: "12px",
                border: "1px solid black",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Form onSubmit={handleFormSubmit}>
                <div className="row">
                  <div className="col-12" >
                    <div className="row">
                      <div className="col-md-3">
                      <Form.Group
                              controlId="description"
                              style={{
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                marginRight: "10px",
                              }}
                            >
                              <Form.Label>Description:</Form.Label>
                            </Form.Group>
                      </div>
                      <div className="col-md-9">
                      <Form.Group
                              controlId="description"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Form.Control
                                type="text"
                                placeholder="Description"
                                name="AreDscc"
                                value={values.AreDscc}
                                onChange={handleInputChange}
                                onKeyDown={(e) =>
                                  handleEnterKeyPress(ENTER2, e)
                                }
                                ref={ENTER1}
                                style={{ height: "24px", width: "270px" }}
                              />
                            </Form.Group>
                      </div>

                    </div>
                    <div className="row">
                      <div className="col-md-3">
                      <Form.Group
                              controlId="status"
                              style={{
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                marginRight: "10px",
                              }}
                            >
                              <Form.Label>Status:</Form.Label>
                            </Form.Group>
                      </div>
                      <div className="col-md-9">
                      <Form.Group
                              controlId="status"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Form.Control
                                as="select"
                                name="AreStss"
                                value={selectedStatus}
                                onChange={(e) =>
                                  setSelectedStatus(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  handleEnterKeyPress(ENTER3, e)
                                }
                                ref={ENTER2}
                                style={{
                                  height: "30px",
                                  width: "100px",
                                  fontSize: "11px",
                                }}
                              >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </Form.Control>
                            </Form.Group>

                      </div>

                    </div>
                    <div className="row">
                      <div className="col-md-3"></div>
                      <div className="col-md-9">
                      <Button
                              className="btn btn-primary"
                              style={{
                                backgroundColor: primaryColor,
                                fontSize: "11px",
                                color: secondaryColor,
                                width: "50%",
                              }}
                              onClick={handleFormSubmit}
                              ref={ENTER3}
                            >
                              SUBMIT
                            </Button>
                      </div>

                    </div>


                  

                      
                  </div>
                </div>
              </Form>
            </div>
          </div>
          <br />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Add_Area;
