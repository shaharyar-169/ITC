import axios from "axios";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { useNavigate } from 'react-router-dom'
import itc from '../../itc.png'
import { HiRefresh } from "react-icons/hi";
import { FaCalendar, FaArrowLeft } from "react-icons/fa6";
import { Container, Row, Spinner, Navbar, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileCsv, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import '../../dailysalereport.css';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { components } from 'react-select';


export default function PriceListReport() {
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
    const [searchstatedata, setsearchstatedata]= useState([]);
    const [companyData, setcompanyData] = useState([])
    const [categoryData, setcategoryData] = useState([])
    const [isloading, setisloading] = useState(false)


///////////// States for Sortingindicator///////////////////
const [issortforSerialnumber, setissortforSerialnumber]= useState(false);
const [issortforItemcode, setissortforItemcode]= useState(false);
const [issortforItemDescription, setissortforItemDescription]= useState(false);
const [issortforstatus, setissortforstatus]= useState(false);
const [issortforActRate, setissortforActRate]= useState(false);
const [issortforPurRate, setissortforPurRate]= useState(false);
const [issortforSmRate, setissortforSmRate]= useState(false);
const [issortforRtiRate, setissortforRtiRate]= useState(false);
const [issortforHifRate, setissortforHifRate]= useState(false);
const [issortforFixRate, setissortforFixRate]= useState(false);
/////////////////////////////////////////////////////////////


// state initialize for table row highlight 
const [selectedIndex, setSelectedIndex] = useState(-1); // Initialize selectedIndex state

  
const typeSelectRef = useRef(null);
const nevigate = useNavigate();

// Global date variable 
const currentDate = moment().format("DD-MM-YYYY");

// api url variable
const dashboardUrl = "https://crystalsolutions.com.pk/iqbaltrader/web/PriceList.php";


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

              
            })
            .catch((error) => {
                console.error("Error:", error);
                // Log the error and inspect the response to diagnose the issue.
            });
    }

// useeffect fot initial render and call the fetchDailysaleData function  
    useEffect(() => {
        fetchDailysaleData();
        setisloading(true);
    }, []);

// useeffect for submit click and then call the fetchDailysaleData function
    useEffect(() => {
        if (submitClicked) {
            setcompanyselect(null)
            fetchDailysaleData();
            setSubmitClicked(false);
        }
    }, [submitClicked]);

     const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitClicked(true);
    };

// function nevigate to the mainpage
    const handlebackSubmit = (event) => {
        event.preventDefault();
        nevigate('/MainPage');

    }


  
    const handlePdfDownload = () => {
        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = filteredDailysale.map((item, index) => [
            (index + 1).toString(), // Index starting from 1
            item.titmcod,
            item.titmdsc,
            item.titmsts,      
            item.tactrat,  
            item.tpurrat,  
            item.tmanrat,  
            item.trtlrat,  
            item.thlfrat,  
            item.tfixrat,
        ]);
        
        
        // Define table column headers and individual column widths
        const headers = ['#','Item Code','Description', 'Sts', 'Act Rate', 'Pur Rate', 'SM Rate', 'Rti Rate', 'Hif Rate', 'Fix Rate'];
        const columnWidths = [20,30, 80, 10,20,20,20,20,20,20];
    
    
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
        row.forEach((cell, cellIndex) => {
            const cellY = startY + ((i - startIndex + 2) * rowHeight) + 3;
            doc.rect(startX, startY + ((i - startIndex + 2) * rowHeight), columnWidths[cellIndex], rowHeight);
            doc.text(startX + 2, cellY, cell);
            startX += columnWidths[cellIndex];
        });
        startX = (doc.internal.pageSize.width - tableWidth) / 2; // Adjusted for center alignment
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
        const rowsPerPage = 27; // Adjust this value based on your requirements
               


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
                addTitle('Price List Report', time,"",  pageNumber, startY, 10, 8); // Render sale report title with decreased font size, provide the time, and page number
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
   
    const handleCsvDownload = () => {
        // Define table column headers
        const headers = ['#','Item Code','Description', 'Sts', 'Act Rate', 'Pur Rate', 'SM Rate', 'Rti Rate', 'Hif Rate', 'Fix Rate'];

        // Create CSV content
        let csvContent = headers.join(',') + '\n';

        // Add rows to CSV content
        filteredDailysale.forEach((item, index) => { // Add 'index' as the second argument
            const row = [
               (index + 1).toString(), // Index starting from 1
               item.titmcod,
               `"${item.titmdsc}"`,
               item.titmsts,      
               item.tactrat,  
               item.tpurrat,  
               item.tmanrat,  
               item.trtlrat,  
               item.thlfrat,  
               item.tfixrat,
            ];
        
            const formattedRow = row.map(val => {
                // Handle special characters or formatting if needed for each column
                return isNaN(val) ? `"${val}"` : val; // Enclose non-numeric values in quotes
            });
        
            csvContent += formattedRow.join(',') + '\n';
        });

      
        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a URL from the Blob
        const url = URL.createObjectURL(blob);

        // Create a link element and trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'table_data.csv');
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };



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

// set the search state 
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

// handle the status All, Active and non-active    
    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
        const filteredData = filterData(saleType, selectedTransactionType,companyselect, categoryselect);
        setFilteredDailysale(filteredData);
        setpreviousFilteredData(filteredData);
    };


// filterdata is the main function for all the filters 
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
        if (companyselect  ) {
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



// function for shortcut Key
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

 
// api call for company data
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

 // Transforming company fetched data into options array
 const Companyoption = companyData.map(item => ({
    value: item.tcmpcod,
    label: `${item.tcmpcod}-${item.tcmpdsc.trim()}`
}));

// api call for category data
    useEffect(() => {
        const apiUrl = 'https://crystalsolutions.com.pk/iqbaltrader/web/CategoryList.php';
        axios.post(apiUrl)
            .then(response => {
                setcategoryData(response.data);
                console.log(`categoryList: ${response.data}`);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Transforming category fetched data into options array
    const categoryoption = categoryData.map(item => ({
        value: item.tctgcod,
        label: `${item.tctgcod}-${item.tctgdsc.trim()}`
    }));


    // styling for Select dropdown option
    const DropdownOption = (props) => {
        return (
            <components.Option {...props}>
                <div style={{ borderBottom: '1px solid #ccc', fontSize: '12px', padding: '0', margin: '0', width: 'auto'}}>
                    {props.data.label}
                </div>
            </components.Option>
        );
    };

    // styling for react select component 
    const customStyles = {
        control: (base, state) => ({
          ...base,
          height: '24px',
          fontSize:'12px',
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
                        backgroundColor: '#1f2670' ,
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
                        Reports &nbsp;&gt;&nbsp; Lists &nbsp;&gt;&nbsp; Price List
                    </p>
                </div>

            </header>


            <Container style={{ width: '980px', display: 'flex', justifyContent: 'center', border:'1px solid #cccccc' }} className="mt-2">
                <div className="pt-2 pb-2">
                    <div className="parent ">
                        <div className="child1" style={{marginBottom:'5px'}}>
                            <div className="d-flex align-itrms-center">
                                <label htmlFor="company" className="d-flex align-items-center"><span style={{ fontSize: '12px', fontWeight:'bold' }}>Company :</span></label>
                                <div className="company-select-class" >
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
                                <lable htmlFor="status"><span style={{ fontSize: '12px', fontWeight:'bold' }}>Status :</span></lable>
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
                                        marginLeft: '38px',
                                        textAlign: 'center',
                                        background: 'white',
                                        border: '1px solid black',
                                        fontSize:'12px'

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
                                    <label htmlFor="category" className="d-flex align-items-center"><span style={{ fontSize: '12px', fontWeight:'bold' }}>Category :</span></label>
                                    <div className="company-select-class"  style={{marginLeft:'2px'}}>
                                        <Select
                                            className="List-select-class"
                                            options={categoryoption}
                                            onChange={(selectedOption) => {
                                                if (selectedOption && selectedOption.value) {
                                                    setcategoryselect(selectedOption.value);
                                                } else {
                                                    setcategoryselect(null);
                                                }
                                                
                                                const filteredData = filterData(saleType, transectionType, selectedOption ? selectedOption.value : null, companyselect);
                                                setFilteredDailysale(filteredData);
                                                setpreviousFilteredData(filteredData);
                                            }}
                                            components={{ Option: DropdownOption }}
                                            styles={customStyles}
                                            isClearable
                                            placeholder ="Search or select..."
                                        />
                                    </div>
                                </div>
                        

                            </div>

                            <div style={{ marginLeft: '50px' }}>
                                <label htmlFor="searchInput" style={{ paddingRight: '35px' }}><span style={{ fontSize: '12px', fontWeight:'bold' }}>Search :</span> </label>
                                <input
                                    type="text"
                                    id="searchInput"
                                    placeholder="item description"
                                    value={searchQuery}
                                    style={{ width: '200px', fontSize:'12px', height: '24px', border: '1px solid black', outline: 'none', paddingLeft:'10px' }}
                                    // onChange={(e) => setSearchQuery(e.target.value)}
                                    onChange={handleSearchChange}
                                />
                            </div>

                        </div>
                    </div>



                    <Row >
                         <MDBTable responsive striped scrollY maxHeight="560px"  id='dailysale-table' className="MDB-table" >
                            <MDBTableHead style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}>
                                <tr>


                                 {/* <th
                                        style={{
                                            cursor: 'default',
                                            position: 'relative',
                                        }}
                                        onClick={() => handleCodeHeaderClick("index", issortforSerialnumber, setissortforSerialnumber)}
                                    >
                                        #
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transform: issortforSerialnumber ? 'rotate(180deg)' : 'none',
                                                transition: 'transform 0.3s ease',
                                            }}
                                        >
                                            &#9662;
                                        </span>
                                </th> */}
                                <th>#</th>
                                 
                                <th
                                        style={{
                                            cursor: 'default',
                                            position: 'relative',
                                        }}
                                        onClick={() => handleCodeHeaderClick("titmcod", issortforItemcode, setissortforItemcode)}
                                    >
                                        Item Code
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
                                        onClick={() => handleCodeHeaderClick('titmdsc', issortforItemDescription, setissortforItemDescription)}
                                    >
                                        Item Description
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
                                        onClick={() => handleCodeHeaderClick('titmsts', issortforstatus, setissortforstatus)}
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
                                    
                                <th
                                        style={{
                                            cursor: 'default',
                                            position: 'relative',
                                        }}
                                        onClick={() => handleCodeHeaderClick('tactrat', issortforActRate, setissortforActRate)}
                                    >
                                        Act Rate
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transform: issortforActRate ? 'rotate(180deg)' : 'none',
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
                                        onClick={() => handleCodeHeaderClick('tpurrat', issortforPurRate, setissortforPurRate)}
                                    >
                                        Pur Rate
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transform: issortforPurRate ? 'rotate(180deg)' : 'none',
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
                                        onClick={() => handleCodeHeaderClick('tmanrat', issortforSmRate, setissortforSmRate)}
                                    >
                                        SM Rate
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transform: issortforSmRate ? 'rotate(180deg)' : 'none',
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
                                        onClick={() => handleCodeHeaderClick('trtlrat', issortforRtiRate, setissortforRtiRate)}
                                    >
                                        Rti Rate
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transform: issortforRtiRate ? 'rotate(180deg)' : 'none',
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
                                        onClick={() => handleCodeHeaderClick('thlfrat', issortforHifRate, setissortforHifRate)}
                                    >
                                        Hif Rate
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transform: issortforHifRate ? 'rotate(180deg)' : 'none',
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
                                        onClick={() => handleCodeHeaderClick('tfixrat', issortforFixRate, setissortforFixRate)}
                                    >
                                        Fix Rate
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transform: issortforFixRate ? 'rotate(180deg)' : 'none',
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
                                           <tr 
                                            key={index}
                                            onClick={() => handleRowClick(index)} // Add click event handler
                                            className={selectedIndex === index ? 'selected-row' : ''} // Apply 'selected-row' class based on selection
                                            style={{ cursor: 'pointer' }} // Add cursor pointer
                                        >
                                           
                                                <td style={{ width: '50px' }}>{index+1}</td>
                                                <td style={{ width: '100px', textAlign: 'left' }}>{item.titmcod}</td>
                                                <td className='table-col-item-description' style={{ width: '320px' }}>{item.titmdsc}</td>
                                                <td style={{ width: '30px' }}>{item.titmsts}</td>
                                                <td className="list-same-col-width"style={{textAlign:'right'}}>{item.tactrat}</td>
                                                <td className='list-same-col-width'style={{textAlign:'right'}}>{item.tpurrat}</td>
                                                <td className='list-same-col-width'style={{textAlign:'right'}}>{item.tmanrat}</td>
                                                <td className='list-same-col-width' style={{textAlign:'right'}}>{item.trtlrat}</td>
                                                <td className='list-same-col-width' style={{textAlign:'right'}}>{item.thlfrat}</td>
                                                <td className='list-same-col-width'style={{textAlign:'right'}} >{item.tfixrat}</td>

                                            </tr>
                                        ))
                                )}


                                {/* Fill remaining empty rows if data is less than 17 */}
                                {Array.from({ length: Math.max(24 - filteredDailysale.length, 0) }).map((_, rowIndex) => (
                                    <tr key={`empty-row-${rowIndex}`}>
                                        <td className={` ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '50px' }}>&nbsp;</td>
                                        <td className={` ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '100px' }}></td>
                                        <td className={`table-col-item-description ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '320px' }}></td>
                                        <td className={` ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '30px' }}></td>
                                        <td className={`list-same-col-width ${filteredDailysale.length === 0 ? 'empty-style' : ''}`}style={{width:'80px'}}></td>
                                        <td className={`list-same-col-width ${filteredDailysale.length === 0 ? 'empty-style' : ''}`}style={{width:'80px'}} ></td>
                                        <td className={`list-same-col-width ${filteredDailysale.length === 0 ? 'empty-style' : ''}`}style={{width:'80px'}} ></td>
                                        <td className={`list-same-col-width ${filteredDailysale.length === 0 ? 'empty-style' : ''}`}style={{width:'80px'}}></td>
                                        <td className={`list-same-col-width ${filteredDailysale.length === 0 ? 'empty-style' : ''}`}style={{width:'80px'}}></td>
                                        <td className={`list-same-col-width ${filteredDailysale.length === 0 ? 'empty-style' : ''}`}style={{width:'80px'}} ></td>

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
                                <th className="text-left" colSpan={2}>
                                <FontAwesomeIcon icon={faFilePdf} style={{marginLeft:'10px', color:'white'}} onClick={handlePdfDownload} className="custom-icon "  title="Download PDF" />
                                <FontAwesomeIcon icon={faFileCsv}  style={{marginLeft:'10px', color:'white'}} onClick={handleCsvDownload} className="custom-icon"  title="Download CSV" />
                                </th>
                               
                              <th colSpan={2}>
                                
                              </th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>


                        </MDBTable>



                        {/* </div> */}

                    </Row>



                </div>


            </Container >


        </div >
    );
}
