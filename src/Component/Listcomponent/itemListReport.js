import axios from "axios";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { useNavigate } from 'react-router-dom'
import itc from '../../itc.png'
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { BsCalendar } from 'react-icons/bs'
import { HiRefresh } from "react-icons/hi";
import { FaCalendar, FaArrowLeft } from "react-icons/fa6";
import { Container, Row, Spinner, Navbar, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileCsv, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import '../../dailysalereport.css';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { components } from 'react-select';


export default function ItemListReport() {
    const [dailysale, setDailysale] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDailysale, setFilteredDailysale] = useState([]);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [saleType, setSaleType] = useState('All');
    const [transectionType, settransectionType] = useState('All');
    const [selectedstatus, setselectedstatus] = useState('All')
    const [companyselect, setcompanyselect] = useState(null);
    const [categoryselect, setcategoryselect] = useState(null);
    const [previousFilteredData, setpreviousFilteredData] = useState([]);
    const [searchstatedata, setsearchstatedata] = useState([])
    const [companyData, setcompanyData] = useState([])
    const [categoryData, setcategoryData] = useState([])
    const [isloading, setisloading] = useState(false)


    console.log("catedata" + categoryData);
    // state for from DatePicker
    const [selectedfromDate, setSelectedfromDate] = useState(null);
    const [fromInputDate, setfromInputDate] = useState('');
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // state for To DatePicker
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [toInputDate, settoInputDate] = useState('');
    const [toCalendarOpen, settoCalendarOpen] = useState(false);

    console.log(transectionType)
    console.log(companyselect)
    console.log(categoryselect)
    console.log(searchQuery)


    const fromRef = useRef(null);
    const saleSelectRef = useRef(null);
    const typeSelectRef = useRef(null);
    const nevigate = useNavigate();

    const currentDate = moment().format("DD-MM-YYYY");




    const handlefromDateChange = (date) => {
        setSelectedfromDate(date);
        setfromInputDate(date ? formatDate(date) : '');
        setfromCalendarOpen(false);
    };
    const handlefromInputChange = (e) => {
        setfromInputDate(e.target.value);
    };
    const handlefromKeyPress = (e, inputId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const formattedInput = fromInputDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3');
            const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

            if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
                const [day, month, year] = formattedInput.split('-').map(Number);

                if (month > 12 || month === 0) {
                    alert('Please enter a valid month (MM) between 01 and 12');
                    return;
                }

                const daysInMonth = new Date(year, month, 0).getDate();
                if (day > daysInMonth || day === 0) {
                    alert(`Please enter a valid day (DD) for month ${month}`);
                    return;
                }

                const currentDate = new Date(); // Get the current date
                const enteredDate = new Date(year, month - 1, day); // Month in JavaScript Date starts from 0 (0 - January, 1 - February, ...)

                if (enteredDate > currentDate) {
                    alert(`From date cannot be greater than the To date.\n\nPlease enter the correct date in Format DD-MM-YYYY`);
                    return;
                }

                setfromInputDate(formattedInput);

                // const nextInput = document.getElementById(nextInputId);
                // console.log('Next input ID:', nextInputId);
                //  console.log('Next input:', nextInput);
                // if (nextInput) {
                //   nextInput.select();
                //   nextInput.focus()
                // } else {
                //   // Handle submission when in the last input field
                //   handleSubmit();
                // }
                const nextInput = document.getElementById(inputId);
                console.log('Next input ID:', nextInput);
                if (nextInput) {
                    nextInput.focus();
                    nextInput.select();
                } else {
                    document.getElementById('submitButton').click(); // Trigger form submission
                }
            } else {
                alert('Please enter a valid date in the format DD-MM-YYYY');

            }
        }
    };
    // Toggle the FromcalendarOpen state on each click
    const toggleFromCalendar = () => {
        setfromCalendarOpen(prevOpen => !prevOpen);
    };
    const handleToDateChange = (date) => {
        setSelectedToDate(date);
        settoInputDate(date ? formatDate(date) : '');
        settoCalendarOpen(false);
    };
    const handleToInputChange = (e) => {
        settoInputDate(e.target.value);
    };
    const handleToKeyPress = (e, inputId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const formattedInput = toInputDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3');
            const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

            if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
                const [day, month, year] = formattedInput.split('-').map(Number);

                if (month > 12 || month === 0) {
                    alert('Please enter a valid month (MM) between 01 and 12');
                    return;
                }

                const daysInMonth = new Date(year, month, 0).getDate();
                if (day > daysInMonth || day === 0) {
                    alert(`Please enter a valid day (DD) for month ${month}`);
                    return;
                }

                const currentDate = new Date(); // Get the current date
                const enteredDate = new Date(year, month - 1, day); // Month in JavaScript Date starts from 0 (0 - January, 1 - February, ...)

                if (enteredDate > currentDate) {
                    alert(`To date cannot be greater than the current date.\n\nPlease enter the correct date in Format DD-MM-YYYY`);
                    return;
                }

                if (fromInputDate) {
                    const fromDate = new Date(fromInputDate.split('-').reverse().join('-'));
                    if (enteredDate <= fromDate) {
                        alert(`Todate cannot be smaller than or equal to the From date.\nPlease enter a valid Todate.`);
                        return;
                    }
                }

                settoInputDate(formattedInput);
                //     console.log('Next input ID:', nextInputId);
                // console.log('Next input:', nextInput);
                //     const nextInput = document.getElementById(nextInputId);
                //     if (nextInput) {
                //       nextInput.select();
                //       nextInput.focus()
                //     } else {
                //       // Handle submission when in the last input field
                //       handleSubmit();
                //     }
                const nextInput = document.getElementById(inputId);
                console.log('Next input ID:', nextInput);
                if (nextInput) {
                    nextInput.focus();
                    if (nextInput.tagName === 'SELECT') {
                        // nextInput.select();
                        nextInput.focus();

                        // nextInput.click();

                    }
                } else {
                    document.getElementById('submitButton').click(); // Trigger form submission
                }
            } else {
                alert('Please enter a valid date in the format DD-MM-YYYY');
            }
        }
    };
    const handleSaleKeypress = (event, inputId) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const nextInput = document.getElementById(inputId);

            if (nextInput) {
                nextInput.focus();
            } else {
                document.getElementById('submitButton').click(); // Trigger form submission
            }
        }
    };
    const handleTypeKeypress = (event, inputId) => {

        if (event.key === 'Enter') {
            event.preventDefault();
            const nextInput = document.getElementById(inputId);

            if (nextInput) {
                nextInput.focus();
            } else {
                document.getElementById('submitButton').click(); // Trigger form submission
            }
        }
    };
    // Toggle the ToCalendarOpen state on each click
    const toggleToCalendar = () => {
        settoCalendarOpen(prevOpen => !prevOpen);
    };
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };







    const dashboardUrl = "https://crystalsolutions.com.pk/iqbaltrader/web/ItemList.php";


    // function fecthing data for dailySales
    function fetchDailysaleData() {
        setisloading(true);
        axios
            .post(dashboardUrl, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
            .then((response) => {
                setDailysale(response.data);
                console.log('dailysale sale data', response.data);
                setFilteredDailysale(response.data)
                setpreviousFilteredData(response.data)
                setsearchstatedata(response.data);
                console.log('filtered dailysale data', response.data)
                setisloading(false);

                // const filteredData = filterData(saleType, transectionType, response.data);
                // setFilteredDailysale(filteredData);
                // setpreviousFilteredData(filteredData);
                // console.log('filtered dailysale data', response.data);

            })
            .catch((error) => {
                console.error("Error:", error);
                // Log the error and inspect the response to diagnose the issue.
            });
    }

    useEffect(() => {
        fetchDailysaleData();
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitClicked(true);
    };

    const handlebackSubmit = (event) => {
        event.preventDefault();
        nevigate('/MainPage');

    };


    useEffect(() => {
        if (submitClicked) {
            // fetchDailysaleData(formatDate(fromInputDate), formatDate(toInputDate));
            fetchDailysaleData(fromInputDate, toInputDate);

            setSubmitClicked(false);
        }
    }, [submitClicked]);



    // code for search filter
    useEffect(() => {
        if (searchQuery === '') {
            // If search query is cleared, show previous data or original data
            if (previousFilteredData.length > 0) {
                setFilteredDailysale(previousFilteredData);
            } else {
                setFilteredDailysale(filteredDailysale);
            }
            return;
        }

        // Filter the data based on the current search query
        const filteredData = filteredDailysale.filter(item => {
            // Filter based on the search query if it's not empty
            if (searchQuery !== '') {
                return item.titmdsc && item.titmdsc.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        })

        if (filteredData.length === 0) {
            // If no results for the current query, revert to previous data based on the query
            const prevFilteredByQuery = previousFilteredData.filter((item) => {
                const itemDesc = item.titmdsc ? item.titmdsc.toLowerCase() : '';
                return itemDesc.includes(searchQuery.toLowerCase());

            });
            setFilteredDailysale(prevFilteredByQuery);
        } else {
            // Display matching rows for the current query
            setFilteredDailysale(filteredData);
        }
    }, [searchQuery]);


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };






    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
        const filteredData = filterData(saleType, selectedTransactionType,companyselect, categoryselect);
        setFilteredDailysale(filteredData);
        setpreviousFilteredData(filteredData);

    };


    const filterData = (selectedSaleType, selectedTransactionType, companyselect, categoryselect) => {
        let filteredData = [...searchstatedata];

        if (selectedSaleType !== 'All') {
            filteredData = filteredData.filter((item) => {
                if (selectedSaleType === 'cash') {
                    return item.trefcod && item.trefcod.startsWith('12');
                } else if (selectedSaleType === 'credit') {
                    return !item.trefcod || !item.trefcod.startsWith('12');
                }
                return true; // For 'All', return all data
            });
        }

        if (selectedTransactionType !== 'All') {
            filteredData = filteredData.filter((item) => {
                if (selectedTransactionType === 'Active') {
                    return item.titmsts === 'A';
                } else if (selectedTransactionType === 'Non-Active') {
                    return item.titmsts === 'N';
                }
                return true; // For 'All', return all data
            });
        }


        // Apply the additional filter based on selectedCompanyCode
        if (companyselect) {
            filteredData = filteredData.filter((item) => {
                return item.tcmpcod === companyselect;
            });
        }

        // Apply the additional filter based on selectedCategoryCode
        if (categoryselect) {
            filteredData = filteredData.filter((item) => {
                return item.tctgcod === categoryselect;
            });
        }

        

        return filteredData;
    };


    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Define table column headers
        const headers = ['item code', 'item Description', 'Sts', 'Pur Rate', 'Sm Rate', 'Rti Rate'];

        // Define table rows from the table body
        const rows = filteredDailysale.map(item => [
            item.titmcod,
            item.titmdsc,
            item.titmsts,
            item.tpurrat,
            item.tmanrat,
            item.trtlrat,

        ]);

        // Set the font size to 10
        doc.setFontSize(5);

        // Add table headers and rows
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 10 // Adjust the starting Y position for the table
        });

        // Save the PDF
        doc.save('table_data.pdf');
    };

    const handleDownloadCSV = () => {
        // Define table column headers
        const headers = ['item code', 'item Description', 'Sts', 'Pur Rate', 'Sm Rate', 'Rti Rate'];

        // Create CSV content
        let csvContent = headers.join(',') + '\n';

        // Add rows to CSV content
        filteredDailysale.forEach(item => {

            const row = [
                item.titmcod,
                item.titmdsc,
                item.titmsts,
                item.tpurrat,
                item.tmanrat,
                item.trtlrat,
            ];

            csvContent += row.join(',') + '\n';
        });

        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'table_data.csv');

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
    };








    const handleShortcutKeyPress = (event) => {
        // Check if the event matches the specific shortcut (Alt+S)
        if (event.altKey && event.key === 'r') {
            event.preventDefault();  // Close the default browser behavior

            // Trigger the click event on the submit button
            const submitButton = document.getElementById('submitButton');
            if (submitButton) {
                submitButton.click();
                submitButton.focus();

            }

        }
    };
    useEffect(() => {
        const handleKeyDown = (event) => {
            // event.preventDefault();
            if (event.altKey && event.key === 's') {
                event.preventDefault();
                handlebackSubmit(event);
            }
            //  else if (event.altKey && event.key === 's') {
            //   handlebackSubmit(event);
            // }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    // Add event listener to detect key presses
    useEffect(() => {
        window.addEventListener('keydown', handleShortcutKeyPress);
        return () => {
            window.removeEventListener('keydown', handleShortcutKeyPress);
        };
    }, []);



    //  Total of Amount, Quantity, SaleRate

    const Prutotal = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.tpurrat.replace(/,/g, '') || 0), 0);
    const SmRate = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.tmanrat || 0), 0);
    const RtiRate = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.trtlrat.replace(/,/g, '') || 0), 0);



    // Format totals with commas
    const formattedPrutotal = Prutotal.toLocaleString('en-US', { maximumFractionDigits: 2 });
    const formattedSmRate = SmRate.toLocaleString('en-US', { maximumFractionDigits: 2 });
    const formattedRtiRate = RtiRate.toLocaleString('en-US', { maximumFractionDigits: 2 });





    useEffect(() => {
        const apiUrl = 'https://crystalsolutions.com.pk/iqbaltrader/web/CompanyList.php';
        axios.post(apiUrl)
            .then(response => {
                setcompanyData(response.data);
                console.log(`companyList: ${response.data}`);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Transforming fetched data into options array
    const Companyoption = companyData.map(item => ({
        value: item.tcmpcod,
        label: `${item.tcmpcod}-${item.tcmpdsc.trim()}`
    }));


    useEffect(() => {
        const apiUrl = 'https://crystalsolutions.com.pk/iqbaltrader/web/Category.php';
        axios.post(apiUrl)
            .then(response => {
                setcategoryData(response.data);
                console.log(`categoryList: ${response.data}`);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Transforming fetched data into options array
    const Categoryoption = categoryData.map(item => ({
        value: item.tcmpcod,
        label: `${item.tcmpcod}-${item.tcmpdsc.trim()}`
    }));


    // styling for Select option
    const DropdownOption = (props) => {
        return (
            <components.Option {...props}>
                <div style={{ borderBottom: '1px solid #ccc', fontSize: '10px', padding: '0', margin: '0', width: 'auto' }}>
                    {props.data.label}
                </div>
            </components.Option>
        );
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            height: '24px',
            minHeight: 'unset',
            width: 200,
            borderRadius: 0,
            border: '1px solid black',
            transition: 'border-color 0.15s ease-in-out',
            '&:hover': {
                borderColor: state.isFocused ? base.borderColor : 'black',
            },
            padding: '0 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: 30,
        }),
        dropdownIndicator: base => ({
            ...base,
            padding: '5px',
        }),
    };




    return (
        <div>
            <Navbar
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #ccc",
                    height: '40px'
                }}>
                <div style={{
                    flex: "1",
                    marginRight: "1rem",
                    position: 'relative',
                }}>

                    <img src={itc} alt="Logo" style={{ maxWidth: "50px", marginLeft: '10px' }} />
                    <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '0' }}>
                        <p style={{ margin: '0', textAlign: 'center' }}>{currentDate}</p>
                    </div>
                </div>
            </Navbar>

            <header
                style={
                    {
                        width: '100%',
                        height: '30px',
                        backgroundColor: '#003B73',
                        display: 'flex',
                        // justifyContent:'center',
                        alignItems: 'center'
                    }}>
                <div style={{ marginLeft: '40px', cursor: 'pointer', color: 'white', fontSize: '22px', display: 'flex', alignItems: 'center' }}>
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
                </div>

                <div
                    style={{
                        marginLeft: '30px',
                        cursor: 'pointer', color:
                            'white', fontSize: '22px',
                        display: 'flex', alignItems: 'center'
                    }}>

                    <Form onSubmit={handleSubmit}>
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


                </div>

                <div style={{ marginLeft: '60px', marginRight: '20px' }}>
                    <p style={{ margin: '0', fontFamily: 'Sans-serif', fontWeight: '700', fontSize: '15px', lineHeight: '1', textAlign: 'left', color: 'white' }}>
                        Reports &nbsp;&gt;&nbsp; Lists &nbsp;&gt;&nbsp; Item List
                    </p>
                </div>

            </header>


            <Container style={{ width: '680px', display: 'flex', justifyContent: 'center', border: '1px solid #cccccc' }} className="mt-2">
                <div className="pt-2 pb-2 ">
                    <div className="parent ">
                        <div className="child1" >
                            <div className="d-flex align-itrms-center">
                                <label htmlFor="company" className="d-flex align-items-center"><span style={{ fontSize: '10px' }}>Company:</span></label>
                                <div className="company-select-class">
                                    <Select
                                        className="List-select-class"
                                        options={Companyoption}
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                setcompanyselect(selectedOption.value);
                                            } else {
                                                setcompanyselect(null);
                                            }
                                            
                                            const filteredData = filterData(saleType, transectionType, selectedOption ? selectedOption.value : null, categoryselect);
                                            setFilteredDailysale(filteredData);
                                            setpreviousFilteredData(filteredData);
                                        }}
                                        components={{ Option: DropdownOption }}
                                        styles={customStyles}
                                        isClearable
                                        placeholder="Search or select..."
                                    />
                                </div>
                            </div>

                            <div id="lastDiv" className="d-flex align-items-center">
                                <lable htmlFor="status"><span style={{ fontSize: '10px' }}>Status:</span></lable>
                                <select
                                    ref={typeSelectRef}
                                    // onKeyDown={(e) => handleTypeKeypress(e, 'submitButton')}
                                    id="selectedtype"
                                    name="type"
                                    value={transectionType}
                                    onChange={handleTransactionTypeChange}

                                    style={{
                                        width: '200px',
                                        height: '24px',
                                        marginLeft: '35px',
                                        textAlign: 'center',
                                        background: 'white',
                                        border: '1px solid black',
                                        fontSize: '10px'

                                    }}>
                                    <option value="All">All</option>
                                    <option value="Active">Active</option>
                                    <option value="Non-Active">Non-Active</option>
                                </select>
                            </div>

                        </div>



                        <div className="child2" >
                            <div className="d-flex">
                                <div className="d-flex align-itrms-center">
                                    <label htmlFor="category" className="d-flex align-items-center"><span style={{ fontSize: '10px' }}>Category:</span></label>
                                    <div className="company-select-class" style={{ marginLeft: '2px' }}>
                                        <Select
                                            className="List-select-class"
                                            options={Categoryoption}
                                            onChange={(selectedOption) => {
                                                if (selectedOption && selectedOption.value) {
                                                    setcategoryselect(selectedOption.value);
                                                } else {
                                                    setcategoryselect(null);
                                                }
                                            }}
                                            components={{ Option: DropdownOption }}
                                            styles={customStyles}
                                            isClearable
                                            placeholder="Search or select..."
                                        />
                                    </div>
                                </div>


                            </div>

                            <div style={{ marginLeft: '50px' }}>
                                <label htmlFor="searchInput" style={{ paddingRight: '33px' }}><span style={{ fontSize: '10px' }}>Search:</span> </label>
                                <input
                                    type="text"
                                    id="searchInput"
                                    placeholder="item description"
                                    value={searchQuery}
                                    style={{ width: '200px', fontSize: '10px', height: '24px', border: '1px solid black', outline: 'none', paddingLeft: '10px' }}
                                    // onChange={(e) => setSearchQuery(e.target.value)}
                                    onChange={handleSearchChange}
                                />
                            </div>

                        </div>
                    </div>



                    <Row >
                        {/* <div style={{ position:'relative' }}> */}
                        <MDBTable responsive striped scrollY maxHeight="570px" id='dailysale-table' className="MDB-table" >
                            <MDBTableHead style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}>
                                <tr>


                                    <th>Code</th>
                                    <th>Item Description</th>
                                    <th>Sts</th>
                                    <th>Pur rate</th>
                                    <th>Sm Rate</th>
                                    <th>Rti Rate</th>

                                </tr>
                            </MDBTableHead>

                            <MDBTableBody id="dailysale-table-body">
                                {/* Conditionally render the Spinner or the data */}
                                {isloading ? (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        <Spinner animation="border" variant="primary" />
                                    </div>



                                ) : (
                                    filteredDailysale
                                        .map((item, index) => (
                                            <tr key={index}>
                                                <td className="list-same-col-width">{item.titmcod}</td>
                                                <td className='table-col-item-description' style={{ width: '250px' }}>{item.titmdsc}</td>
                                                <td style={{ width: '30px' }}>{item.titmsts}</td>
                                                <td className="list-same-col-width">{item.tpurrat}</td>
                                                <td className='list-same-col-width'>{item.tmanrat}</td>
                                                <td className='list-same-col-width'>{item.trtlrat}</td>



                                            </tr>
                                        ))
                                )}


                                {/* Fill remaining empty rows if data is less than 17 */}
                                {Array.from({ length: Math.max(24 - filteredDailysale.length, 0) }).map((_, rowIndex) => (
                                    <tr key={`empty-row-${rowIndex}`}>
                                        <td className={` ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '80px' }}>&nbsp;</td>
                                        <td className={`table-col-item-description ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '250px' }}></td>
                                        <td className={` ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '30px' }}></td>
                                        <td className={`list-same-col-width ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '80px' }}></td>
                                        <td className={`list-same-col-width ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '80px' }}></td>
                                        <td className={`list-same-col-width ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '80px' }}></td>

                                    </tr>
                                ))}


                                {/* {Array.from({ length: Math.max(0, 18 - filteredDailysale.length) }).map((_, rowIndex) => (
                                    <tr key={`blank-${rowIndex}`}>
                                        {Array.from({ length: 10 }).map((_, colIndex) => (
                                            <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                                        ))}
                                    </tr>
                                ))} */}



                            </MDBTableBody>



                            {/* Render total row */}


                            <tr style={{ position: 'sticky', bottom: '0', backgroundColor: 'rgb(235, 135, 64)' }}>
                                <th className="text-left" colSpan={1}>
                                    <FontAwesomeIcon icon={faFilePdf} style={{ marginLeft: '10px' }} className="custom-icon" onClick={handleDownloadPDF} title="Download PDF" />
                                    <FontAwesomeIcon icon={faFileCsv} style={{ marginLeft: '10px' }} className="custom-icon" title="Download CSV" />
                                </th>

                                <th colSpan={2}>
                                    Total
                                </th>

                                <th>{formattedPrutotal}</th>
                                <th>{formattedSmRate}</th>
                                <th>{formattedRtiRate}</th>
                            </tr>


                        </MDBTable>



                        {/* </div> */}

                    </Row>




                </div>


            </Container >


        </div >
    );
}
