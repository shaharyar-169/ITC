// import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import PathHead from "../../MainComponent/PathHead/PathHead";
import Header from "../../MainComponent/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HiRefresh } from "react-icons/hi";
import { FaCalendar, FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../MainComponent/Footer/Footer";
import "./Customer_Maintenance.css";
import { Container, Row, Spinner, Navbar, Button, Form } from "react-bootstrap";

function Customer_Maintenance() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("Yes");
  const [selectedStatus1, setSelectedStatus1] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("Startup");
  const [selectedUnitId, setSelectedUnitId] = useState("Startup");

  const [alertData, setAlertData] = useState(null);

  const [selectedType, setSelectedType] = useState("Item Purchase");
  const [selectedUnit, setSelectedUnit] = useState("Quantity");

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  const [alert, setAlert] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);
  // const { primaryColor, fontFamily } = useTheme();
  // const { secondaryColor, apiLinks } = useTheme();
  const nevigate = useNavigate();

  const primaryColor = "#c90b13";
  const secondaryColor = "white";
  const fontFamily = "verdana";
  const apiLinks = "https://crystalsolutions.com.pk/resdemo1";

  const handleImageChange1 = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage1(file);
      const imgElement = document.getElementById("pic-preview");
      imgElement.src = URL.createObjectURL(file);
    }
  };
  {
    /* ////////////////////////  DUE TO GET DATA OF CATEGORY ////////////////////////// */
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiLinks}/get_category.php`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const apiData = await response.json();
        setData(apiData.data);

        // Set the selectedCategoryId with the first category ID from the API data
        if (apiData.length > 0) {
          setSelectedCategoryId(apiData.data[0].tctgid);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiLinks}/get_uom.php`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const apiData = await response.json();
        setData1(apiData);

        // Set the selectedCategoryId with the first category ID from the API data
        if (apiData.length > 0) {
          setSelectedUnitId(apiData[0].uomid);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const UserId = 33;

  {
    /* ////////////////////////  CALL API TO POST DATA ////////////////////////// */
  }

  ////////////////////////get item id show them in inout field//////////////////////////
  const [item, setItem] = useState([]);
  const [nextItemId, setNextItemId] = useState(1); // Initialize the next TItmId

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiLinks}/get_item.php`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const apiData = await response.json();
        setItem(apiData);

        // Find the maximum TItmId in the existing data
        const maxItemId = Math.max(
          ...apiData.map((item) => parseInt(item.TItmId))
        );
        // Set the nextItemId to be one greater than the maximum TItmId
        setNextItemId(maxItemId + 1);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  //////////////////////// PRESS ENTER TO MOVE THE NEXT FIELD //////////////////
  const CustomerCode = useRef();
  const ManualCode1 = useRef();
  const ManualCode2 = useRef();
  const Status = useRef();
  const Name = useRef();
  const FatherName = useRef();
  const Address1 = useRef();
  const Address2 = useRef();
  const Phone = useRef();
  const Mobile = useRef();
  const Id = useRef();
  const Area = useRef();
  const Type = useRef();
  const Group = useRef();
  const P_Profession = useRef();
  const P_Phone = useRef();
  const P_Income = useRef();
  const P_Official = useRef();
  const C_Collector = useRef();
  const C_Mode = useRef();
  const G_Name = useRef();
  const G_FatherName = useRef();
  const G_Address1 = useRef();
  const G_Address2 = useRef();
  const G_Id = useRef();
  const G_Mobile = useRef();
  const W_Name = useRef();
  const W_FatherName = useRef();
  const W_Address1 = useRef();
  const W_Address2 = useRef();
  const W_Id = useRef();
  const W_Mobile = useRef();
  const Verified = useRef();
  const Button = useRef();
  const Submit = useRef();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const fields = [
      CustomerCode,
      ManualCode1,
      ManualCode2,
      Status,
      Name,
      FatherName,
      Address1,
      Address2,
      Phone,
      Mobile,
      Id,
      Area,
      Type,
      Group,
      P_Profession,
      P_Phone,
      P_Income,
      P_Official,
      C_Collector,
      C_Mode,
      G_Name,
      G_FatherName,
      G_Address1,
      G_Address2,
      G_Id,
      G_Mobile,
      W_Name,
      W_FatherName,
      W_Address1,
      W_Address2,
      W_Id,
      W_Mobile,
      Verified,
      Button,
      Submit,
    ];

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

    if (selectedImage1 === null) {
      setAlertData({
        type: "error",
        message: "Please select an image.",
      });
      setTimeout(() => {
        setAlertData(null);
      }, 3000);

      return;
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
  const customScrollbarStyle = `
  ::-webkit-scrollbar {
    width: 8px;
    color: black;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: red;
    border-radius: 6px;
  }
`;
const handlebackSubmit = (event) => {
  event.preventDefault();
  nevigate('/MainPage');

}
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
             <header
                style={
                    {
                        width: '100%',
                        height: '30px',
                        backgroundColor: '#1f2670' ,
                        display: 'flex',
                        // justifyContent:'center',
                        alignItems: 'center'
                    }}>
                      <>
                {/* <div style={{ marginLeft: '40px', cursor: 'pointer', color: 'white', fontSize: '22px', display: 'flex', alignItems: 'center' }}>
                    <Form onSubmit={handlebackSubmit}>
                        <Button
                            id="handlebackSubmit"
                            type="submit"
                            // className="btn btn-outline-primary"
                            variant="outline-primary"
                            style={{
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',

                            }}
                        >
                            <FaArrowLeft style={{ color: 'white', fontSize: '23px' }} />
                        </Button>
                    </Form>
                </div> */}

                {/* <div
                    style={{
                        marginLeft: '30px',
                        cursor: 'pointer', color:
                            'white', fontSize: '22px',
                        display: 'flex', alignItems: 'center'
                    }}>

                    <Form >
                        <Button
                            id="submitButton"
                            type="submit"
                            // className="btn btn-outline-primary"
                            variant="outline-primary"
                            style={{
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <HiRefresh style={{ color: 'white', fontSize: '23px' }} />
                        </Button>
                    </Form>


                </div> */}

                <div style={{ marginLeft: '60px', marginRight: '20px' }}>
                    <p style={{ margin: '0', fontFamily: 'Sans-serif', fontWeight: '700', fontSize: '15px', lineHeight: '1', textAlign: 'left', color: 'white' }}>
                        File &nbsp;&gt;&nbsp; Customer Maintenance 
                    </p>
                </div>
                </>
            </header>
        

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
                maxWidth: "970px",
                margin: "20px 0",
                fontSize: "11px",
                border: "2px solid black",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Form onSubmit={handleFormSubmit}>
                {/* <div style="max-height: 60vh; overflow-y: auto;"> */}
                <style>{customScrollbarStyle}</style>

                <div
                  style={{
                    maxHeight: "70vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <div className="row">
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-2 label">Customer_Code:</div>
                        <div className="col-md-3">
                          <Form.Control
                            type="number"
                            id="code"
                            placeholder=" Id"
                            name="itmIdd"
                            className="form-control"
                            // value={nextItemId} // Display the nextItemId
                            ref={CustomerCode}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(ManualCode1, e)
                            }
                          />
                        </div>
                        <div className="col-md-2 label">Manual Code:</div>
                        <div className="col-md-5" style={{ display: "flex" }}>
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder=""
                            name="Description"
                            className="form-control"
                            ref={ManualCode1}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(ManualCode2, e)
                            }
                          />
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder=""
                            name="Description"
                            className="form-control"
                            ref={ManualCode2}
                            onKeyDown={(e) => handleEnterKeyPress(Name, e)}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">Name:</div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Full Name"
                            name="Name"
                            className="form-control"
                            ref={Name}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(FatherName, e)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">Father Name:</div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Father Name"
                            name="Name"
                            className="form-control"
                            ref={FatherName}
                            onKeyDown={(e) => handleEnterKeyPress(Address1, e)}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">Address:</div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Address1"
                            name="Name"
                            className="form-control"
                            ref={Address1}
                            onKeyDown={(e) => handleEnterKeyPress(Address2, e)}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label"></div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Addrss2"
                            name="Name"
                            className="form-control"
                            ref={Address2}
                            onKeyDown={(e) => handleEnterKeyPress(Phone, e)}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">Phone:</div>
                        <div className="col-md-5">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Phone No."
                            name="phonenumber"
                            className="form-control"
                            ref={Phone}
                            onKeyDown={(e) => {
                              // Allow only numeric characters, backspace, delete, and arrow keys
                              if (
                                !/^\d$/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight"
                              ) {
                                e.preventDefault();
                              }
                              handleEnterKeyPress(Mobile, e);
                            }}
                          />
                        </div>
                        <div className="col-md-1"></div>
                        <div className="col-md-1 label">Mobile:</div>
                        <div className="col-md-3">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Mobile No."
                            name="Name"
                            className="form-control"
                            maxLength={11}
                            ref={Mobile}
                            onKeyDown={(e) => {
                              if (
                                !/^\d$/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight"
                              ) {
                                e.preventDefault();
                              }
                              handleEnterKeyPress(Id, e);
                            }}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">ID No:</div>
                        <div className="col-md-5">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="CNIC Number"
                            name="Name"
                            className="form-control"
                            ref={Id}
                            maxLength={15}
                            onKeyDown={(e) => {
                              if (
                                !/^\d$/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight"
                              ) {
                                e.preventDefault();
                              }
                              handleEnterKeyPress(Area, e);
                            }}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">Area:</div>
                        <div className="col-md-5">
                          <Form.Control
                            as="select"
                            name="categoryIdd"
                            onChange={(e) => {
                              setSelectedCategoryId(e.target.value);
                            }}
                            ref={Area}
                            onKeyDown={(e) => handleEnterKeyPress(Type, e)}
                            id="categoryIdd"
                            style={{
                              height: "27px",
                              fontSize: "11px",
                            }}
                            className="form-control"
                          >
                            {data.map((item) => (
                              <option key={item.tctgid} value={item.tctgid}>
                                {item.tctgdsc}
                              </option>
                            ))}
                          </Form.Control>
                        </div>
                        <div className="col-md-1"></div>

                        <div className="col-md-1 label">Type:</div>
                        <div className="col-md-3">
                          <Form.Control
                            as="select"
                            name="categoryIdd"
                            onChange={(e) => {
                              setSelectedCategoryId(e.target.value);
                            }}
                            ref={Type}
                            onKeyDown={(e) => handleEnterKeyPress(Status, e)}
                            id="categoryIdd"
                            style={{
                              height: "27px",
                              fontSize: "11px",
                            }}
                            className="form-control"
                          >
                            {data.map((item) => (
                              <option key={item.tctgid} value={item.tctgid}>
                                {item.tctgdsc}
                              </option>
                            ))}
                          </Form.Control>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="row">
                        <div className="col-md-3 label">Status:</div>
                        <div className="col-md-9">
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
                              onChange={(e) =>
                                setSelectedStatus(e.target.value)
                              }
                              className="form-control custom-select" // Add the custom CSS class 'custom-select'
                              style={{
                                height: "27px",
                                fontSize: "11px",
                              }}
                              onKeyDown={(e) => handleEnterKeyPress(Group, e)}
                              ref={Status}
                            >
                              <option value="Active">Active</option>
                              <option value="No">Non Active</option>
                            </Form.Control>
                          </Form.Group>
                        </div>
                      </div>
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <div className="row">
                        <div className="col-md-3 label">Group:</div>
                        <div className="col-md-9">
                          <Form.Control
                            as="select"
                            name="categoryIdd"
                            onChange={(e) => {
                              setSelectedCategoryId(e.target.value);
                            }}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(P_Profession, e)
                            }
                            ref={Group}
                            id="categoryIdd"
                            style={{
                              height: "27px",
                              fontSize: "11px",
                            }}
                            className="form-control"
                          >
                            {data.map((item) => (
                              <option key={item.tctgid} value={item.tctgid}>
                                {item.tctgdsc}
                              </option>
                            ))}
                          </Form.Control>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row" style={{ borderTop: "1px solid gray" }}>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-2 label">Profession:</div>
                        <div className="col-md-5">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Profession"
                            name="Name"
                            className="form-control"
                            ref={P_Profession}
                            onKeyDown={(e) => handleEnterKeyPress(P_Phone, e)}
                          />
                        </div>
                        <div className="col-md-1"></div>

                        <div className="col-md-1 label">Phone:</div>
                        <div className="col-md-3">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Phone No."
                            name="Name"
                            className="form-control"
                            ref={P_Phone}
                            onKeyDown={(e) => {
                              if (
                                !/^\d$/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight"
                              ) {
                                e.preventDefault();
                              }
                              handleEnterKeyPress(P_Income, e);
                            }}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-2 label">Official:</div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Official Address"
                            name="Name"
                            className="form-control"
                            ref={P_Official}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(C_Collector, e)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label"></div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Official Address"
                            name="Name"
                            className="form-control"
                            // ref={P_Official}
                            // onKeyDown={(e) => handleEnterKeyPress(C_Collector, e)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="row">
                        <div className="col-md-3 label">Income:</div>
                        <div className="col-md-9">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Income"
                            name="Description"
                            className="form-control"
                            ref={P_Income}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(P_Official, e)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row" style={{ borderTop: "1px solid gray" }}>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-2 label">Collector:</div>
                        <div className="col-md-5">
                          <Form.Control
                            as="select"
                            name="categoryIdd"
                            onChange={(e) => {
                              setSelectedCategoryId(e.target.value);
                            }}
                            ref={C_Collector}
                            onKeyDown={(e) => handleEnterKeyPress(C_Mode, e)}
                            id="categoryIdd"
                            style={{
                              height: "27px",
                              fontSize: "11px",
                            }}
                            className="form-control"
                          >
                            {data.map((item) => (
                              <option key={item.tctgid} value={item.tctgid}>
                                {item.tctgdsc}
                              </option>
                            ))}
                          </Form.Control>
                        </div>
                        <div className="col-md-1"></div>

                        <div className="col-md-1 label">Mode:</div>
                        <div className="col-md-3">
                          <Form.Control
                            as="select"
                            name="categoryIdd"
                            onChange={(e) => {
                              setSelectedCategoryId(e.target.value);
                            }}
                            ref={C_Mode}
                            onKeyDown={(e) => handleEnterKeyPress(G_Name, e)}
                            id="categoryIdd"
                            style={{
                              height: "27px",
                              fontSize: "11px",
                            }}
                            className="form-control"
                          >
                            {data.map((item) => (
                              <option key={item.tctgid} value={item.tctgid}>
                                {item.tctgdsc}
                              </option>
                            ))}
                          </Form.Control>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3"></div>
                  </div>
                  <div className="row" style={{ borderTop: "1px solid gray" }}>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-2 label">Guart Name:</div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Guarantor Name"
                            name="Name"
                            className="form-control"
                            ref={G_Name}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(G_FatherName, e)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">Fth Name:</div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Guarantor Father Name"
                            name="Name"
                            className="form-control"
                            ref={G_FatherName}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(G_Address1, e)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">Address:</div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Guarantor Address1"
                            name="Name"
                            className="form-control"
                            ref={G_Address1}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(G_Address2, e)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label"></div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Guarantor Address2"
                            name="Name"
                            className="form-control"
                            ref={G_Address2}
                            onKeyDown={(e) => handleEnterKeyPress(G_Id, e)}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">CNIC ID:</div>
                        <div className="col-md-5">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Guarantor CNIC Number"
                            name="Name"
                            className="form-control"
                            ref={G_Id}
                            maxLength={15}
                            onKeyDown={(e) => {
                              if (
                                !/^\d$/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight"
                              ) {
                                e.preventDefault();
                              }
                              handleEnterKeyPress(G_Mobile, e);
                            }}
                          />
                        </div>
                        <div className="col-md-1"></div>

                        <div className="col-md-1 label">Mobile:</div>
                        <div className="col-md-3">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Guarantor Mobile No."
                            name="Name"
                            className="form-control"
                            ref={G_Mobile}
                            maxLength={11}
                            onKeyDown={(e) => {
                              if (
                                !/^\d$/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight"
                              ) {
                                e.preventDefault();
                              }
                              handleEnterKeyPress(W_Name, e);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div class="col-md-3"></div>
                  </div>
                  <div className="row" style={{ borderTop: "1px solid gray" }}>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-2 label">Witness Name:</div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Witness Name"
                            name="Name"
                            className="form-control"
                            ref={W_Name}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(W_FatherName, e)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">Father Name:</div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Witness Father Name"
                            name="Name"
                            className="form-control"
                            ref={W_FatherName}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(W_Address1, e)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">Address:</div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Witness Address1"
                            name="Name"
                            className="form-control"
                            ref={W_Address1}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(W_Address2, e)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label"></div>
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Witness Address2"
                            name="Name"
                            className="form-control"
                            ref={W_Address2}
                            onKeyDown={(e) => handleEnterKeyPress(W_Id, e)}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2 label">CNIC ID:</div>
                        <div className="col-md-5">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Witness CNIC Number"
                            name="Name"
                            className="form-control"
                            ref={W_Id}
                            maxLength={15}
                            onKeyDown={(e) => {
                              if (
                                !/^\d$/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight"
                              ) {
                                e.preventDefault();
                              }
                              handleEnterKeyPress(W_Mobile, e);
                            }}
                          />
                        </div>
                        <div className="col-md-1"></div>

                        <div className="col-md-1 label">Mobile:</div>
                        <div className="col-md-3">
                          <Form.Control
                            type="text"
                            id="code"
                            placeholder="Witness Mobile No."
                            name="Name"
                            className="form-control"
                            ref={W_Mobile}
                            maxLength={11}
                            onKeyDown={(e) => {
                              if (
                                !/^\d$/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight"
                              ) {
                                e.preventDefault();
                              }
                              handleEnterKeyPress(Verified, e);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3"></div>
                  </div>
                  <div className="row" style={{ borderTop: "1px solid gray" }}>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-2 label">Verified By:</div>
                        <div className="col-md-5">
                          <Form.Control
                            as="select"
                            name="categoryIdd"
                            onChange={(e) => {
                              setSelectedCategoryId(e.target.value);
                            }}
                            ref={Verified}
                            onKeyDown={(e) => handleEnterKeyPress(Button, e)}
                            id="categoryIdd"
                            style={{
                              height: "27px",
                              fontSize: "11px",
                            }}
                            className="form-control"
                          >
                            {data.map((item) => (
                              <option key={item.tctgid} value={item.tctgid}>
                                {item.tctgdsc}
                              </option>
                            ))}
                          </Form.Control>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3"></div>
                  </div>
                  <div className="row" style={{ borderTop: "1px solid gray" }}>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-4 label"></div>
                        <div
                          className="col-md-4"
                          style={{
                            width: "110px",
                            height: "100px",
                            border: "4px dashed black",
                            borderRadius: "50px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                          }}
                        >
                          <label
                            htmlFor="pic"
                            style={{ cursor: "pointer", position: "relative" }}
                          >
                            <img
                              id="pic-preview"
                              src=""
                              // alt="Upload"
                              style={{
                                width: "105px",
                                height: "95px",
                                borderRadius: "50px",
                                display: "block",
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                bottom: "1px",
                                backgroundColor: "rgba(255, 255, 255, 0.7)", // Added background color
                                padding: "2px 5px", // Added padding for better visibility
                                borderRadius: "5px", // Added border radius for a rounded look
                                fontSize: "9px",
                                textAlign: "center",
                                // marginLeft: "15%",
                              }}
                            >
                              Upload you picture
                            </span>
                            <input
                              type="file"
                              id="pic"
                              style={{ display: "none" }}
                              onChange={handleImageChange1}
                            />
                          </label>
                        </div>
                        <div className="col-md-1 label"></div>
                        <div className="col-md-4">
                          <div
                            style={{
                              height: "90px",
                              width: "200px",
                              border: "1px solid black",
                            }}
                          >
                            <svg
                              class="text-indigo-500 w-20 h-50 mb-3 "
                              style={{ marginLeft: "40%" }}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <input
                              class="form-control form-control-sm"
                              id="formFileSm"
                              type="file"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3"></div>
                  </div>
                </div>
                <div className="row" style={{ borderTop: "1px solid gray" }}>
                  <div className="col-md-2"></div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-primary"
                      style={{
                        backgroundColor: primaryColor,
                        fontSize: "11px",
                        color: secondaryColor,
                        marginTop: "4%",
                        width: "100%",
                      }}
                      // onClick={handleFormSubmit}
                      // ref={Button}
                    >
                      Save
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-primary"
                      style={{
                        backgroundColor: primaryColor,
                        fontSize: "11px",
                        color: secondaryColor,
                        width: "100%",
                        marginTop: "4%",
                      }}
                      // onClick={handleFormSubmit}
                      // ref={Submit}
                    >
                      Return
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-primary"
                      style={{
                        backgroundColor: primaryColor,
                        fontSize: "11px",
                        color: secondaryColor,
                        width: "100%",
                        marginTop: "4%",
                      }}
                      // onClick={handleFormSubmit}
                      // ref={Submit}
                    >
                      Print
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-primary"
                      style={{
                        backgroundColor: primaryColor,
                        fontSize: "11px",
                        color: secondaryColor,
                        marginTop: "4%",

                        width: "100%",
                      }}
                      // onClick={handleFormSubmit}
                      // ref={Submit}
                    >
                      New
                    </button>
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

export default Customer_Maintenance;
