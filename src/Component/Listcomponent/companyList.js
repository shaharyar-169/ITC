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
import { Document, Page, Text, View, StyleSheet ,PDFRenderer  } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import '../../dailysalereport.css';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { components } from 'react-select';


export default function CompanyListReort() {
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
    const [searchstatedata, setsearchstatedata]=useState([])
    const [showSpinner, setShowSpinner] = useState(false);
         

const [issortforItemcode, setissortforItemcode]= useState(false);
const [issortforItemDescription, setissortforItemDescription]= useState(false);
const [issortforstatus, setissortforstatus]= useState(false);

// state initialize for table row highlight 
const [selectedIndex, setSelectedIndex] = useState(-1); // Initialize selectedIndex state

    console.log(transectionType)
    console.log(companyselect)
    console.log(categoryselect)
    console.log(searchQuery)


    const fromRef = useRef(null);
    const saleSelectRef = useRef(null);
    const typeSelectRef = useRef(null);
    const nevigate = useNavigate();

    const currentDate = moment().format("DD-MM-YYYY");



    const dashboardUrl = "https://crystalsolutions.com.pk/iqbaltrader/web/CompanyList.php";


    // function fecthing data for dailySales
    function fetchDailysaleData() {
        setShowSpinner(true);
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
                setShowSpinner(false);

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
            fetchDailysaleData();
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
                return item.tcmpdsc && item.tcmpdsc.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        })

        if (filteredData.length === 0) {
            // If no results for the current query, revert to previous data based on the query
            const prevFilteredByQuery = previousFilteredData.filter((item) => {
                const itemDesc = item.tcmpdsc ? item.tcmpdsc.toLowerCase() : '';
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
        console.log(selectedTransactionType);
        settransectionType(selectedTransactionType);
        const filteredData = filterData(saleType, selectedTransactionType);
        setFilteredDailysale(filteredData);
        setpreviousFilteredData(filteredData);
    };


    const filterData = (selectedSaleType, selectedTransactionType ) => {
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
                    return item.tcmpsts === 'A';
                } else if (selectedTransactionType === 'Non-Active') {
                    return item.tcmpsts === 'N';
                }
                return true; // For 'All', return all data
            });
        }

     return filteredData;
    };


    ////////////////////Code for Sorting in Ascending and descending order/////////////////////

const handleCodeHeaderClick = (keyvalue, isSortedAscending, setIsSortedAscending) => {
    // Toggle the sorting order when the header is clicked
    setIsSortedAscending((prev) => !prev);
  
    // Sort the data based on the sorting order
    const sortedData = [...filteredDailysale].sort((a, b) => {
        // Remove commas and check if both values are numeric
        const numericA = parseFloat(a[keyvalue].replace(/,/g, ''));
        const numericB = parseFloat(b[keyvalue].replace(/,/g, ''));
  
        // Check if both values are numeric and hyphenated
        const isNumericHyphenA = /^\d+-\d+-\d+$/.test(a[keyvalue]);
        const isNumericHyphenB = /^\d+-\d+-\d+$/.test(b[keyvalue]);
  
        if (isNumericHyphenA && isNumericHyphenB) {
            // If both values are numeric and hyphenated, compare them directly
            return isSortedAscending
                ? new Date(a[keyvalue]) - new Date(b[keyvalue])
                : new Date(b[keyvalue]) - new Date(a[keyvalue]);
        } else if (!isNaN(numericA) && !isNaN(numericB)) {
            // If both values are numeric, compare them directly
            return isSortedAscending
                ? numericA - numericB
                : numericB - numericA;
        } else if (!isNaN(numericA)) {
            // If only A is numeric, it should come before B
            return -1;
        } else if (!isNaN(numericB)) {
            // If only B is numeric, it should come before A
            return 1;
        } else {
            // If both are non-numeric or have other characters, compare them as strings
            return isSortedAscending
                ? a[keyvalue].localeCompare(b[keyvalue])
                : b[keyvalue].localeCompare(a[keyvalue]);
        }
    });
  
    // Update the state with the sorted data
    setFilteredDailysale(sortedData);
    setpreviousFilteredData(sortedData);
  };
/////////////////////////////////////////////////////////////////////


    const handlePdfDownload = () => {
        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "potrate" });

        // Define table data (rows)
        const rows = filteredDailysale.map(item => [
            item.tcmpcod,
            item.tcmpdsc,
            item.tcmpsts,                   
        ]);
    
        // Define table column headers and individual column widths
        const headers = ['Code', 'Description', 'Sts'];
        const columnWidths = [20, 150, 10];
    
        // Calculate total table width
        const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
    
        // Define page height and padding
        const pageHeight = doc.internal.pageSize.height;
        const paddingTop = 20;
        const paddingBottom = 20;
    
        // Set font properties for the table
        doc.setFont("Verdana");
        doc.setFontSize(10);
    
         
        // Function to add table headers
        const addTableHeaders = (startX, startY) => {
            // Set font style and size for headers
            doc.setFont('bold'); // Set font to bold
            doc.setFontSize(12); // Set font size for headers
        
            headers.forEach((header, index) => {
                const cellWidth = columnWidths[index];
                const cellHeight = 6; // Height of the header row
                const cellX = startX + (cellWidth / 2); // Center the text horizontally
                const cellY = startY + (cellHeight / 2) + 1.5; // Center the text vertically
        
                // Draw the outer border
                doc.setLineWidth(0.2); // Set the width of the outer border
                doc.rect(startX, startY+0.5, cellWidth, cellHeight);
        
                // Draw the inner border (to achieve the double border effect)
                doc.setLineWidth(0.2); // Set the width of the inner border
                doc.rect(startX , startY , cellWidth, cellHeight);
        
                // Set text alignment to center
                doc.setTextColor(0); // Set text color to black
                doc.text(cellX, cellY, header, null, null, 'center'); // Center the text
                startX += columnWidths[index]; // Move to the next column
            });
        
            // Reset font style and size after adding headers
            doc.setFont('normal');
            doc.setFontSize(10);
        };
        
          
// Function to add table rows for a page
const addTableRows = (startX, startY, startIndex, endIndex) => {
    const rowHeight = 5; // Adjust this value to decrease row height
    const fontSize = 8; // Adjust this value to decrease font size
    const tableWidth = getTotalTableWidth(); // Calculate total table width
    const pageHeight = doc.internal.pageSize.height; // Get page height

    doc.setFontSize(fontSize);
    
    for (let i = startIndex; i < endIndex; i++) {
        const row = rows[i];
        let isHighlight = false; // Flag to determine if the row needs highlighting
        // Check if the value in the tcmpcod column is greater than 100
        if (parseInt(row[0]) > 100) {
            isHighlight = true; // If true, set the highlight flag
        }
// Draw borders for the entire table
for (let i = startIndex; i < endIndex; i++) {
    const rowY = startY + ((i - startIndex + 2) * rowHeight);
    for (let j = 0; j < rows[i].length; j++) {
        const cellX = startX + columnWidths.slice(0, j).reduce((acc, curr) => acc + curr, 0);
        const cellWidth = columnWidths[j];
        
        // Draw top border
        doc.rect(cellX, rowY, cellWidth, rowHeight);
        
        // Draw left border for the first column
        if (j === 0) {
            doc.rect(cellX, rowY, 0.3, rowHeight);
        }
        
        // Draw right border for the last column
        if (j === rows[i].length - 1) {
            doc.rect(cellX + cellWidth, rowY, 0.3, rowHeight);
        }
    }
}
// Draw borders for the entire table
for (let i = startIndex; i < endIndex; i++) {
    const rowY = startY + ((i - startIndex + 2) * rowHeight);
    for (let j = 0; j < rows[i].length; j++) {
        const cellX = startX + columnWidths.slice(0, j).reduce((acc, curr) => acc + curr, 0);
        const cellWidth = columnWidths[j];
        
        // Draw top border
        doc.rect(cellX, rowY, cellWidth, rowHeight);
        
        // Draw left border for the first column
        if (j === 0) {
            doc.rect(cellX, rowY, 0.3, rowHeight);
        }
        
        // Draw right border for the last column
        if (j === rows[i].length - 1) {
            doc.rect(cellX + cellWidth, rowY, 0.3, rowHeight);
        }
    }
}

        if (isHighlight) {
            doc.setFillColor(246, 71, 71); // Yellow color
            doc.rect(startX, startY + ((i - startIndex + 2) * rowHeight), tableWidth, rowHeight, 'F');
        }
        row.forEach((cell, cellIndex) => {
            const cellY = startY + ((i - startIndex + 2) * rowHeight) + 3;
            doc.text(startX + 2, cellY, cell);
            startX += columnWidths[cellIndex];
        });
        startX = (doc.internal.pageSize.width - tableWidth) / 2; // Adjusted for center alignment
    }
    
       // Draw borders for the entire table
for (let i = startIndex; i < endIndex; i++) {
    const rowY = startY + ((i - startIndex + 2) * rowHeight);
    for (let j = 0; j < rows[i].length; j++) {
        const cellX = startX + columnWidths.slice(0, j).reduce((acc, curr) => acc + curr, 0);
        const cellWidth = columnWidths[j];
        
        // Draw top border
        doc.rect(cellX, rowY, cellWidth, rowHeight);
        
        // Draw left border for the first column
        if (j === 0) {
            doc.rect(cellX, rowY, 0.3, rowHeight);
        }
        
        // Draw right border for the last column
        if (j === rows[i].length - 1) {
            doc.rect(cellX + cellWidth, rowY, 0.3, rowHeight);
        }
    }
}


    // Draw line at the bottom of the page with padding
    const lineWidth = tableWidth; // Match line width with table width
    const lineX = (doc.internal.pageSize.width - tableWidth) / 2; // Center line
    const lineY = pageHeight - 15; // Position the line 20 units from the bottom
    doc.setLineWidth(0.3);
    doc.line(lineX, lineY, lineX + lineWidth, lineY); // Draw line
    const headingFontSize = 12; // Adjust as needed

    // Add heading "Crystal Solution" aligned left bottom of the line
    const headingX = lineX + 2; // Padding from left
    const headingY = lineY + 5; // Padding from bottom
    doc.setFontSize(headingFontSize); // Set the font size for the heading
    doc.text(headingX, headingY, "Crystal Solution");
};






// Function to calculate total table width
const getTotalTableWidth = () => {
    let totalWidth = 0;
    columnWidths.forEach(width => totalWidth += width);
    return totalWidth;
};
  
        // Function to add a new page and reset startY
        const addNewPage = (startY) => {
            doc.addPage();
            return paddingTop; // Set startY for each new page
        };
    
        // Define the number of rows per page
        const rowsPerPage = 45; // Adjust this value based on your requirements
    
            


        // Function to handle pagination
       const handlePagination = () => {
            // Define the addTitle function
            const addTitle = (title, date, time, pageNumber, startY, titleFontSize = 16, dateTimeFontSize = 8, pageNumberFontSize = 8 ) => {
                doc.setFontSize(titleFontSize); // Set the font size for the title
                doc.text(title, doc.internal.pageSize.width / 2, startY, { align: 'center' });
            
                // Calculate the x-coordinate for the right corner
                const rightX = doc.internal.pageSize.width - 10;
            
                if (date) {
                    doc.setFontSize(dateTimeFontSize); // Set the font size for the date and time
                    if (time) {
                        doc.text(date + ' ' + time, rightX, startY, { align: 'right' });
                    } else {
                        doc.text(date, rightX-10, startY, { align: 'right' });
                    }
                }
            
                // Add page numbering
                doc.setFontSize(pageNumberFontSize);
                doc.text(`Page ${pageNumber}`, rightX - 10, doc.internal.pageSize.height - 10, { align: 'right' });
            };
            
        
            let currentPageIndex = 0;
            let startY = paddingTop; // Initialize startY
            let pageNumber = 1; // Initialize page number
            
            while (currentPageIndex * rowsPerPage < rows.length) {
                const date = getCurrentDate(); // Get current date
                const time = getCurrentTime(); // Get current time
                addTitle('IQbal Trading Company', date, '', pageNumber, startY); // Render company title with default font size, only date, and page number
                startY += 5; // Adjust vertical position for the company title
                addTitle('Chart of A/C Report', time,"",  pageNumber, startY, 10, 8); // Render sale report title with decreased font size, provide the time, and page number
                startY += 10; // Adjust vertical position for the sale report title
                addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, startY);
                const startIndex = currentPageIndex * rowsPerPage;
                const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
                startY = addTableRows((doc.internal.pageSize.width - totalWidth) / 2, startY, startIndex, endIndex);
                if (endIndex < rows.length) {
                    startY = addNewPage(startY); // Add new page and update startY
                    pageNumber++; // Increment page number
                }
                currentPageIndex++;
            }
        }; 
        

   
        

              
        const getCurrentDate = () => {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
            const yyyy = today.getFullYear();
            return dd + '/' + mm + '/' + yyyy;
        };
        
        // Function to get current time in the format HH:MM:SS
        const getCurrentTime = () => {
            const today = new Date();
            const hh = String(today.getHours()).padStart(2, '0');
            const mm = String(today.getMinutes()).padStart(2, '0');
            const ss = String(today.getSeconds()).padStart(2, '0');
            return hh + ':' + mm + ':' + ss;
        };
        
               
        
    
        // Call function to handle pagination
        handlePagination();
    
        // Save the PDF file
        doc.save('table_data.pdf');
    };
 

const handleDownloadCSV = () => {
        // Define table column headers
        const headers = ['Code', 'Company Description', 'Sts'];

        // Create CSV content
        let csvContent = headers.join(',') + '\n';

        // Add rows to CSV content
        filteredDailysale.forEach(item => {
            const formattedDate = new Date(item.ttrndat).toLocaleDateString('en-US');

            const row = [
                item.tcmpcod,
                item.tcmpdsc,
                item.tcmpsts,
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




   // Add this function inside your DailySaleReport component
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

 

// Define handleRowClick function for highlight the table row onclick
const handleRowClick = (index) => {
    setSelectedIndex(index); // Update selectedIndex state with the index of the clicked row
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
                        Reports &nbsp;&gt;&nbsp; Lists &nbsp;&gt;&nbsp; company List
                    </p>
                </div>

            </header>


            <Container style={{ width: '500px', display: 'flex', justifyContent: 'center', border: '1px solid #cccccc' }} className="mt-2 ">
                <div className="pt-2 pb-2">
                    <div className="parent ">
                        <div className="child1 mb-1" >
                            <div className="d-flex align-items-center">
                                <lable htmlFor="status"><span style={{ fontSize: '12px', fontWeight:'bold' }}>Status:</span></lable>
                                <select
                                    ref={typeSelectRef}
                                    // onKeyDown={(e) => handleTypeKeypress(e, 'submitButton')}
                                    id="selectedtype"
                                    name="type"
                                    value={transectionType}
                                    onChange={handleTransactionTypeChange}

                                    style={{
                                        width: '150px',
                                        height: '24px',
                                        marginLeft: '10px',
                                        textAlign: 'center',
                                        background: 'white',
                                        border: '1px solid black',
                                        fontSize: '12px'

                                    }}>
                                    <option value="All">All</option>
                                    <option value="Active">Active</option>
                                    <option value="Non-Active">Non-Active</option>
                                </select>
                            </div>




                            <div style={{ marginLeft: '10px' }}>
                                <label htmlFor="searchInput" ><span style={{ fontSize: '12px', fontWeight:'bold', marginRight:"10px", marginLeft:'10px' }}>Search:</span> </label>
                                <input
                                    type="text"
                                    id="searchInput"
                                    placeholder="Type here..."
                                    value={searchQuery}
                                    style={{ width: '150px', height: '24px', border: '1px solid black', outline: 'none', fontSize: '12px', paddingLeft: '10px' }}
                                    // onChange={(e) => setSearchQuery(e.target.value)}
                                    onChange={handleSearchChange}
                                />
                            </div>

                        </div>
                    </div>



                    <Row >
                        {/* <div style={{ position:'relative' }}> */}
                        <MDBTable responsive striped scrollY maxHeight="570px"  id='dailysale-table' className="MDB-table" >
                            <MDBTableHead style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}>
                                <tr>
                                <th
                                        style={{
                                            cursor: 'default',
                                            position: 'relative',
                                        }}
                                        onClick={() => handleCodeHeaderClick("tcmpcod", issortforItemcode, setissortforItemcode)}
                                    >
                                        Code
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transform: issortforItemcode ? 'rotate(180deg)' : 'none',
                                                transition: 'transform 0.3s ease',
                                            }}
                                        >
                                            &#9662;
                                        </span>
                                </th>

                                <th
                                        style={{
                                            cursor: 'default',
                                            position: 'relative',
                                        }}
                                        onClick={() => handleCodeHeaderClick('tcmpdsc', issortforItemDescription, setissortforItemDescription)}
                                    >
                                        Company Description
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transform: issortforItemDescription ? 'rotate(180deg)' : 'none',
                                                transition: 'transform 0.3s ease',
                                            }}
                                        >
                                            &#9662;
                                        </span>
                                </th>
                                   
                                <th
                                        style={{
                                            cursor: 'default',
                                            position: 'relative',
                                        }}
                                        onClick={() => handleCodeHeaderClick('tcmpsts', issortforstatus, setissortforstatus)}
                                    >
                                        Sts
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transform: issortforstatus ? 'rotate(180deg)' : 'none',
                                                transition: 'transform 0.3s ease',
                                            }}
                                        >
                                            &#9662;
                                        </span>
                                </th> 

                                </tr>
                            </MDBTableHead>

                            <MDBTableBody id="dailysale-table-body">
                                {/* Conditionally render the Spinner or the data */}
                                {showSpinner ? (
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
                                            <tr 
                                            key={index}
                                            onClick={() => handleRowClick(index)} // Add click event handler
                                            className={selectedIndex === index ? 'selected-row' : ''} // Apply 'selected-row' class based on selection
                                            style={{ cursor: 'pointer' }} // Add cursor pointer
                                        >
                                                <td style={{ width: '20px' }}>{item.tcmpcod}</td>
                                                <td className='table-col-item-description' style={{ width: '200px' }}>{item.tcmpdsc}</td>
                                                <td style={{ width: '20px' }}>{item.tcmpsts}</td>


                                            </tr>
                                        ))
                                )}

                                {/* Fill remaining empty rows if data is less than 17 */}
                                {Array.from({ length: Math.max(24 - filteredDailysale.length, 0) }).map((_, rowIndex) => (
                                    <tr key={`empty-row-${rowIndex}`}>
                                        <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '20px' }}>&nbsp;</td>
                                        <td className={`table-col-item-description ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '200px' }}></td>
                                        <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '20px' }}></td>
                                  
                                    </tr>
                                ))}



                            </MDBTableBody>



                            {/* Render total row */}


                           
                            <tr style={{ position: 'sticky', bottom: '0', backgroundColor: 'rgb(235, 135, 64)' }}>
                                <th className="text-left " colSpan={3} >
                                <FontAwesomeIcon icon={faFilePdf} className="custom-icon" style={{marginLeft:'10px', color:'white'}} onClick={handlePdfDownload} title="Download PDF" />
                                <FontAwesomeIcon icon={faFileCsv} className="custom-icon" style={{marginLeft:'10px', color:'white'}} onClick={handleDownloadCSV} title="Download CSV" />
                                </th>
                               
                            </tr>

                        </MDBTable>



                        {/* </div> */}

                    </Row>

                    {/* <div className="iconsstyle">
                        <FontAwesomeIcon icon={faFilePdf} onClick={handleDownloadPDF} className="custom-icon no-flex" />
                        <FontAwesomeIcon icon={faFileCsv} onClick={handleDownloadCSV} className="custom-icon no-flex" />
                    
                    </div> */}


                </div>


            </Container >


        </div >
    );
}
