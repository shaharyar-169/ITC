import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import PathHead from "../../MainComponent/PathHead/PathHead";
import Header from "../../MainComponent/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Verifier_Maintenance.css";
import Footer from "../../MainComponent/Footer/Footer";

function Add_Verifier() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("Yes");
  const [alertData, setAlertData] = useState(null);
  const primaryColor = "#c90b13";
  const secondaryColor = "white";
  const fontFamily = "verdana";
  const apiLinks = "https://crystalsolutions.com.pk/iqbaltrader/web";

  //////////////////////// PRESS ENTER TO MOVE THE NEXT FIELD //////////////////
  const Id = useRef();
  const Description = useRef();
  const Status = useRef();
  const Submit = useRef();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const value = {
      vstss: selectedStatus,
    };
    const fields = [Description, Status];

    fields.forEach((fieldRef) => {
      if (fieldRef.current && fieldRef.current.value.trim() === "") {
        fieldRef.current.classList.add("error");
        setTimeout(() => {
          fieldRef.current.classList.remove("error");
        }, 3000);
      }
    });

    const emptyFields = fields.filter(
      (fieldRef) => fieldRef.current && fieldRef.current.value.trim() === ""
    );
    if (emptyFields.length > 0) {
      setAlertData({
        type: "error",
        message: "All fields are required. Please fill in all fields.",
      });
      setTimeout(() => {
        setAlertData(null);
      }, 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("vdsc", Description.current.value);
      formData.append("vsts", value.vstss);
      formData.append("userid", 33);

      axios
        .post(`${apiLinks}/AddVerified.php`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.data.error === 200) {
            setAlertData({
              type: "success",
              message: `${response.data.message}`,
            });
            setTimeout(() => {
              setAlertData(null);
              navigate("/Get_Verifier");
            }, 2000);
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
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle Enter key press
  const handleEnterKeyPress = (ref, e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter key press
      if (ref && ref.current) {
        ref.current.focus();
      }
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

        {/* <PathHead
          pageName="File > Item Maintenance > Add Item"
          screen="Get_Item"
          pageLink="/Get_Item"
        /> */}

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
              overflowY: "scroll", // Enable vertical scrolling
              height: "calc(100vh - 200px)", // Set an appropriate height
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
                fontSize: "11px",
                border: "1px solid black",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Form onSubmit={handleFormSubmit}>
                <div className="row">
                  {/* <div className="row">
                    <div className="col-md-3 label">Id:</div>
                    <div className="col-md-3">
                      <Form.Control
                        type="number"
                        id="code"
                        placeholder=" Id"
                        name="itmIdd"
                        className="form-control"
                        // value={nextItemId} // Display the nextItemId
                        readOnly
                        ref={Id}
                        onKeyDown={(e) => handleEnterKeyPress(Description, e)}
                      />
                    </div>
                  </div> */}
                  <div className="row">
                    <div className="col-md-3 label">Description:</div>
                    <div className="col-md-7" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="code"
                        placeholder=""
                        name="Description"
                        className="form-control"
                        ref={Description}
                        onKeyDown={(e) => handleEnterKeyPress(Status, e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3 label">Status:</div>
                    <div className="col-md-3">
                      <Form.Group
                        controlId="status"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Form.Control
                          as="select"
                          name="itemStss"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="form-control custom-select" // Add the custom CSS class 'custom-select'
                          style={{
                            height: "27px",
                            fontSize: "11px",
                          }}
                          onKeyDown={(e) => handleEnterKeyPress(Submit, e)}
                          ref={Status}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Form.Control>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-primary"
                        style={{
                          backgroundColor: primaryColor,
                          fontSize: "11px",
                          color: secondaryColor,
                          width: "100%",
                          marginTop: "3%",
                        }}
                        // onClick={handleFormSubmit}
                        ref={Submit}
                      >
                        Save
                      </button>
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

export default Add_Verifier;
