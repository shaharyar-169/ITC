import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Header from "../../MainComponent/Header/Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Footer from "../../MainComponent/Footer/Footer";

function Update_Group() {
  const navigate = useNavigate();
  const { tgrpid } = useParams();
  const [alertData, setAlertData] = useState(null);
  const primaryColor = "#c90b13";
  const secondaryColor = "white";
  const fontFamily = "verdana";
  const apiLinks = "https://crystalsolutions.com.pk/iqbaltrader/web";

  const [user, setUser] = useState({
    tedusr: "",
    tgrpid: "",
    tgrpdsc: "",
    tgrpsts: "",
  });

  useEffect(() => {
    fetch(`${apiLinks}/GroupList.php?tgrpid=${tgrpid}`)
      .then((response) => response.json())
      .then((apiData) => {
        const user = apiData.find((item) => item.tgrpid === tgrpid);
        setUser(user);
      })
      .catch((error) => console.error(error));
  }, [tgrpid]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requestBody = new FormData();
    requestBody.append("id", user.tgrpid);
    requestBody.append("gdsc", user.tgrpdsc);
    requestBody.append("gsts", user.tgrpsts);
    requestBody.append("userid", 33);

    axios
      .post(`${apiLinks}/UpdateGroup.php?tgrpid=${tgrpid}`, requestBody)

      .then((response) => {
        if (response.data.error === 200) {
          setAlertData({
            type: "success",
            message: `${response.data.message}`,
          });
          setTimeout(() => {
            setAlertData(null);
            navigate("/Get_Group");
          }, 1000);
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
  };

  /////////////////////// PRESS ENTER TO MOVE THE NEXT FIELD //////////////////

  // Create refs for each input field
  const ENTER1 = useRef(null);
  const ENTER2 = useRef(null);
  const ENTER3 = useRef(null);
  const ENTER4 = useRef(null);
  const ENTER5 = useRef(null);

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
              <Form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Left side (label and input field) */}

                  <div className="col-12">
                    <div className="row">
                      <div className="col-3">
                        <Form.Group
                          controlId="Id"
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            marginRight: "10px",
                          }}
                        >
                          <Form.Label>Id :</Form.Label>
                        </Form.Group>
                      </div>
                      <div className="col-9">
                        <Form.Group
                          controlId="Id"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder=" Id"
                            className="form-control"
                            name="tgrpid"
                            value={user.tgrpid}
                            style={{ height: "24px", width: "70px" }}
                            onChange={handleInputChange}
                            disabled
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3">
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
                      <div className="col-9">
                        <Form.Group
                          controlId="description"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Description"
                            className="form-control"
                            name="tgrpdsc"
                            value={user.tgrpdsc}
                            style={{ height: "24px", width: "270px" }}
                            onChange={handleInputChange}
                            onKeyDown={(e) => handleEnterKeyPress(ENTER2, e)}
                            ref={ENTER1}
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3">
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
                      <div className="col-9">
                        <Form.Group
                          controlId="status"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <Form.Control
                            as="select"
                            name="tgrpsts"
                            value={user.tgrpsts}
                            onChange={handleInputChange}
                            onKeyDown={(e) => handleEnterKeyPress(ENTER3, e)}
                            ref={ENTER2}
                            className="form-control"
                            style={{
                              height: "27px",
                              fontSize: "11px",
                              width: "70px",
                            }}
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3"></div>
                      <div className="col-9">
                        <Button
                          className="btn btn-primary"
                          style={{
                            backgroundColor: primaryColor,
                            fontSize: "11px",
                            color: secondaryColor,
                            width: "50%",
                            marginRight: "2%",
                          }}
                          onClick={handleSubmit}
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

export default Update_Group;
