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
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import '../../dailysalereport.css';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { components } from 'react-select';


export default function EmployeeListReport() {
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
    const [companyData, setcompanyData] = useState([])
    const [categoryData, setcategoryData] = useState([])
    const [isloading, setisloading] = useState(false)




    console.log(transectionType)
    console.log(companyselect)
    console.log(categoryselect)
    console.log(searchQuery)


    const fromRef = useRef(null);
    const saleSelectRef = useRef(null);
    const typeSelectRef = useRef(null);
    const nevigate = useNavigate();

    const currentDate = moment().format("DD-MM-YYYY");












    const dashboardUrl = "https://crystalsolutions.com.pk/iqbaltrader/web/EmployeeList.php";


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
                return item.tempnam && item.tempnam.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        })

        if (filteredData.length === 0) {
            // If no results for the current query, revert to previous data based on the query
            const prevFilteredByQuery = previousFilteredData.filter((item) => {
                const itemDesc = item.tempnam ? item.tempnam.toLowerCase() : '';
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
                    return item.tempsts === 'A';
                } else if (selectedTransactionType === 'Non-Active') {
                    return item.tempsts === 'N';
                }
                return true; // For 'All', return all data
            });
        }

     return filteredData;
    };


    // const handleDownloadPDF = () => {
    //     const doc = new jsPDF();

    //     // Define table column headers
    //     const headers = ['code', 'Company Description', 'Sts'];

    //     // Define table rows from the table body
    //     const rows = filteredDailysale.map(item => [

    //         item.tcmpcod,
    //         item.tcmpdsc,
    //         item.tcmpsts,

    //     ]);

    //     // Set the font size to 10
    //     doc.setFontSize(5);

    //     // Add table headers and rows
    //     doc.autoTable({
    //         head: [headers],
    //         body: rows,
    //         startY: 10 // Adjust the starting Y position for the table
    //     });

    //     // Save the PDF
    //     doc.save('table_data.pdf');
    // };

    // const handleDownloadPDF = () => {
    //     const doc = new jsPDF();
    
    //     // Define table column headers
    //     const headers = ['code', 'Company Description', 'Sts'];
    
    //     // Define table rows from the table body
    //     const rows = filteredDailysale.map(item => [
    //         item.tcmpcod,
    //         item.tcmpdsc,
    //         item.tcmpsts,
    //     ]);
    
    //     // Register Mudranta Bold font
    //     // doc.addFont('path/to/mudranta-bold.ttf', 'Mudranta Bold', 'bold');
    
    //     // Set the font size to 10 and font family to Mudranta Bold for headers
    //     const headStyles = { fontSize: 10, font: 'Mudranta Bold', backgroundColor:'white'}; // Example styles for headers
    
    //     // Set the font size to 8 for body
    //     const bodyStyles = { fontSize: 8 }; // Example styles for body
    
    //     // Add table headers and rows
    //     doc.autoTable({
    //         head: [headers],
    //         body: rows,
    //         startY: 10, // Adjust the starting Y position for the table
    //         headStyles: headStyles, // Apply styles to the header
    //         bodyStyles: bodyStyles, // Apply styles to the body
    //         didDrawCell: (data) => {
    //             // Check if the cell is in the header row
    //             if (data.section === 'head') {
    //                 // Draw border for header cells
    //                 doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'S');
    //             } else {
    //                 // Draw border for body cells
    //                 doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'S');
    //             }
    //         }
    //     });
    
    //     // Save the PDF
    //     doc.save('table_data.pdf');
    // };
    
    const handleDownloadPDF = (filteredDailysale) => {
    // Define the styles for the PDF
    const styles = StyleSheet.create({
        page: {
            padding: 20,
            fontFamily: 'Helvetica',
        },
        header: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
        },
        table: {
            display: 'table',
            width: 'auto',
            borderStyle: 'solid',
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            borderColor: '#000',
        },
        tableRow: {
            flexDirection: 'row',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000',
        },
        tableCell: {
            width: '50%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            borderColor: '#000',
            padding: 5,
            fontSize: 12,
        },
    });

    const formatDate = (date) => {
        const d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    // Define the SalesReportPdf component
    const SalesReportPdf = ({ filteredDailysale }) => (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Sales Report</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Date</Text>
                        <Text style={styles.tableCell}>Code</Text>
                        <Text style={styles.tableCell}>Company Description</Text>
                        <Text style={styles.tableCell}>Status</Text>
                    </View>
                    {filteredDailysale.map((item, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCell}>
                                {formatDate(item.date)} {item.time}
                            </Text>
                            <Text style={styles.tableCell}>{item.tcmpcod}</Text>
                            <Text style={styles.tableCell}>{item.tcmpdsc}</Text>
                            <Text style={styles.tableCell}>{item.tcmpsts}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

    // Render the SalesReportPdf component
    const pdfContent = <SalesReportPdf filteredDailysale={filteredDailysale} />;

    // Generate the PDF blob
    pdfContent.toBlob((blob) => {
        // Save the blob as a PDF file
        saveAs(blob, 'SalesReport.pdf');
    });
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

    // useEffect(() => {
    //     const spinnerTimeout = setTimeout(() => {
    //         setShowSpinner(false); // Hide the spinner after 3 seconds
    //     }, 500); // 3000 milliseconds (3 seconds)

    //     // Clear the timeout when the component unmounts or the dependency changes
    //     return () => clearTimeout(spinnerTimeout);
    // }, []);




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
                        Reports &nbsp;&gt;&nbsp; Lists &nbsp;&gt;&nbsp; Employee List
                    </p>
                </div>

            </header>


            <Container style={{ width: '730px', display: 'flex', justifyContent: 'center', border: '1px solid #cccccc' }} className="mt-2 ">
                <div className="pt-2 pb-2">
                    <div className="parent ">
                        <div className="child1 mb-1" >
                            <div className="d-flex align-items-center">
                                <lable htmlFor="status"><span style={{ fontSize: '10px' }}>Status:</span></lable>
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
                                        fontSize: '10px'

                                    }}>
                                    <option value="All">All</option>
                                    <option value="Active">Active</option>
                                    <option value="Non-Active">Non-Active</option>
                                </select>
                            </div>



                           <div id="lastDiv">
                            <div style={{ marginLeft: '10px' }}>
                                <label htmlFor="searchInput" style={{ paddingRight: '10px' }}><span style={{ fontSize: '10px' }}>Search:</span> </label>
                                <input
                                    type="text"
                                    id="searchInput"
                                    placeholder="Type here..."
                                    value={searchQuery}
                                    style={{ width: '150px', height: '24px', border: '1px solid black', outline: 'none', fontSize: '10px', paddingLeft: '10px' }}
                                    // onChange={(e) => setSearchQuery(e.target.value)}
                                    onChange={handleSearchChange}
                                />
                            </div>
                           </div>

                        </div>
                    </div>



                    <Row >
                        {/* <div style={{ position:'relative' }}> */}
                        <MDBTable responsive striped scrollY maxHeight="570px"  id='dailysale-table' className="MDB-table" >
                            <MDBTableHead style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}>
                                <tr>

                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>FatherName</th>
                                    <th>Designation</th>
                                    <th>Sts</th>

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
                                            <tr key={index}>
                                                <td style={{ width: '20px' }}>{item.tempcod}</td>
                                                <td className='table-col-item-description' style={{ width: '200px' }}>{item.tempnam}</td>
                                                <td className='table-col-item-description' style={{ width: '200px' }}>{item.tempfth}</td>
                                                <td className='table-col-item-description' style={{ width: '200px' }}>{item.tempdsg}</td>
                                                <td style={{ width: '20px' }}>{item.tempsts}</td>


                                            </tr>
                                        ))
                                )}

                                {/* Fill remaining empty rows if data is less than 17 */}
                                {Array.from({ length: Math.max(24 - filteredDailysale.length, 0) }).map((_, rowIndex) => (
                                    <tr key={`empty-row-${rowIndex}`}>
                                        <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '20px' }}>&nbsp;</td>
                                        <td className={`table-col-item-description ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '200px' }}></td>
                                        <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '200px' }}></td>
                                        <td className={`table-col-item-description ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '200px' }}></td>
                                        <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '20px' }}></td>
                                        
                                  </tr>
                                ))}



                            </MDBTableBody>



                            {/* Render total row */}


                           
                            <tr style={{ position: 'sticky', bottom: '0', backgroundColor: 'rgb(235, 135, 64)' }}>
                                <th className="text-left " colSpan={5} >
                                <FontAwesomeIcon icon={faFilePdf} className="custom-icon" style={{marginLeft:'10px'}} onClick={handleDownloadPDF} title="Download PDF" />
                                <FontAwesomeIcon icon={faFileCsv} className="custom-icon" style={{marginLeft:'10px'}} onClick={handleDownloadCSV} title="Download CSV" />
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
