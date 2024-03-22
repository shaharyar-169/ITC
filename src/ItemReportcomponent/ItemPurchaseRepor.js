import axios from "axios";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { useNavigate } from 'react-router-dom'
import itc from '../itc.png'
import { BsCalendar } from 'react-icons/bs'
import { HiRefresh } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa6";
import { Container, Row, Spinner, Navbar, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileCsv, } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { components } from 'react-select';
// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import 'jspdf-autotable'; // Import jspdf-autotable
// import html2pdf from 'html2pdf';
import DatePicker from 'react-datepicker';
import '../dailysalereport.css';
import 'react-datepicker/dist/react-datepicker.css';

export default function ItemPurchaseReport() {
    const [dailysale, setDailysale] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDailysale, setFilteredDailysale] = useState([]);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [saleType, setSaleType] = useState('All');
    const [transectionType, settransectionType] = useState('All');
    const [previousFilteredData, setpreviousFilteredData] = useState([]);
    const [searchstatedata, setsearchstatedata] = useState([]);
    const [companyselect, setcompanyselect] = useState(null);
    const [categoryselect, setcategoryselect] = useState(null);
    const [companyData, setcompanyData] = useState([]);
    const [categoryData, setcategoryData] = useState([])
    const [showSpinner, setShowSpinner] = useState(false);
    const [isloading, setisloading] = useState(false)


    const [selectedIndex, setSelectedIndex] = useState(-1); // Initialize selectedIndex state

    console.log(selectedIndex)
    // Define handleRowClick function
    const handleRowClick = (index) => {
        setSelectedIndex(index); // Update selectedIndex state with the index of the clicked row
    };


    // state for from DatePicker
    const [selectedfromDate, setSelectedfromDate] = useState(null);
    const [fromInputDate, setfromInputDate] = useState('');
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // state for To DatePicker
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [toInputDate, settoInputDate] = useState('');
    const [toCalendarOpen, settoCalendarOpen] = useState(false);

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

    const dashboardUrl = "https://crystalsolutions.com.pk/iqbaltrader/web/ItemPurchaseReport.php";


    // function fecthing data for dailySales
    function fetchDailysaleData(fintdate, fnldate) {
        setShowSpinner(true);
        const data = new URLSearchParams({ fintdate: fintdate, fnldate: fnldate }).toString();

        axios
            .post(dashboardUrl, data, {
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

                // Apply filters based on sale and transaction types AFTER data is fetched
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
    // useEffect(() => {
    //   const currentDate = new Date();
    //   setSelectedToDate(currentDate);
    //   settoInputDate(formatDate(currentDate));

    //   const firstDateOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    //   setSelectedfromDate(firstDateOfCurrentMonth);
    //   setfromInputDate(formatDate(firstDateOfCurrentMonth));


    //    // Focus on the From Date input field when the component mounts
    //    if (fromRef && fromRef.current) {
    //     fromRef.current.select(); // Select the text within the input field
    //  }
    //   fetchDailysaleData(formatDate(firstDateOfCurrentMonth), formatDate(currentDate));
    // }, []);

    useEffect(() => {
        const currentDate = new Date();
        setSelectedToDate(currentDate);
        settoInputDate(formatDate(currentDate));

        const firstDateOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        setSelectedfromDate(firstDateOfCurrentMonth);
        setfromInputDate(formatDate(firstDateOfCurrentMonth));

        // Check if the component has mounted previously
        const hasComponentMountedPreviously = sessionStorage.getItem('componentMounted');

        // If it hasn't mounted before or on refresh, select the 'from date' input
        if (!hasComponentMountedPreviously || (fromRef && fromRef.current)) {
            if (fromRef && fromRef.current) {
                setTimeout(() => {
                    fromRef.current.focus(); // Focus on the input field
                    fromRef.current.select(); // Select the text within the input field
                }, 0);
            }
            sessionStorage.setItem('componentMounted', 'true'); // Set the flag indicating mount
        }

        fetchDailysaleData(formatDate(firstDateOfCurrentMonth), formatDate(currentDate));

    }, []);
    // const handleSubmit = () => {
    //   if (fromInputDate && toInputDate) {
    //     // const formattedFromDate = formatDate(fromInputDate);
    //     // const formattedToDate = formatDate(toInputDate);
    //     // fetchDailysaleData(formattedFromDate, formattedToDate);
    //     fetchDailysaleData(fromInputDate, toInputDate);

    //     setSubmitClicked(true);
    //   } else {
    //     // Handle case when dates are not selected
    //     alert('Please select both From and To dates');
    //   }
    // };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (fromInputDate && toInputDate) {
            // Fetch data based on date range
            fetchDailysaleData(fromInputDate, toInputDate);
            setSubmitClicked(true);
        } else {
            // Handle case when dates are not selected
            alert('Please select both From and To dates');
        }
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

    // const handlePdfDownload = () => {
    //     // Define table data (rows)
    //     const rows = filteredDailysale.map(item => [
    //         item.titmcod,
    //         item.titmdsc,
    //         item.tpurrat,
    //         item.titmqnt,
    //         item.amount,
    //     ]);

    //     // Create a new jsPDF instance with landscape orientation
    //     const doc = new jsPDF({ orientation: "landscape" });

    //     // Define table column headers and individual column widths
    //     const headers = ['Code', 'Description', 'Rate', 'Qty', 'Amount'];
    //     const columnWidths = [40, 120, 30, 30, 40];

    //     // Define starting position for the table
    //     let tableStartX = 10;
    //     let y = 20;

    //     // Set table header background color and text color
    //     doc.setFillColor(230, 230, 230);
    //     doc.setTextColor(0, 0, 0);

    //     // Set font properties for the table
    //     doc.setFont("Verdana");
    //     doc.setFontSize(10);

    //     // Add table headers with background color and individual column widths
    //     headers.forEach((header, index) => {
    //         doc.rect(tableStartX, y, columnWidths[index], 10, "F");
    //         doc.text(tableStartX + 5, y + 5, header);
    //         tableStartX += columnWidths[index];
    //     });

    //     // Reset starting position for the table
    //     tableStartX = 10;
    //     // Increment y position
    //     y += 10;

    //     // Set table row text color
    //     doc.setTextColor(0, 0, 0);

    //     // Add table rows with borders and individual column widths
    //     rows.forEach((row, rowIndex) => {
    //         row.forEach((cell, cellIndex) => {
    //             doc.rect(tableStartX, y, columnWidths[cellIndex], 10);
    //             doc.text(tableStartX + 5, y + 5, cell);
    //             tableStartX += columnWidths[cellIndex];
    //         });
    //         // Reset starting position for the table
    //         tableStartX = 10;
    //         // Increment y position for next row
    //         y += 10;
    //     });

    //     // Set total row text color
    //     doc.setTextColor(0, 0, 0);

    //     // Add total row with borders and individual column widths
    //     const totalRow = ['', 'TOTAL', '', '', ''];
    //     totalRow.forEach((cell, cellIndex) => {
    //         doc.rect(tableStartX, y, columnWidths[cellIndex], 10);
    //         doc.text(tableStartX + 5, y + 5, cell);
    //         tableStartX += columnWidths[cellIndex];
    //     });

    //     // Save the PDF file
    //     doc.save('table_data.pdf');
    // };




    // const handlePdfDownload = () => {
    //     // Create a new jsPDF instance with landscape orientation
    //     const doc = new jsPDF({ orientation: "landscape" });

    //     // Define table data (rows)
    //     const rows = filteredDailysale.map(item => [
    //       item.titmcod,
    //       item.titmdsc,
    //       item.tpurrat,
    //       item.titmqnt,
    //       item.amount,
    //     ]);

    //     // Define table column headers and individual column widths
    //     const headers = ['Code', 'Description', 'Rate', 'Qty', 'Amount'];
    //     const columnWidths = [40, 120, 30, 10, 40];

    //     // Calculate total table width
    //     const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

    //     // Calculate starting X position to horizontally center the table
    //     let startX = (doc.internal.pageSize.width - totalWidth) / 2;

    //     // Define starting Y position for the table
    //     const startY = 0;

    //     // Set font properties for the table
    //     doc.setFont("Verdana");
    //     doc.setFontSize(10);

    //     // Function to add table headers
    //     const addTableHeaders = () => {
    //       headers.forEach((header, index) => {
    //         doc.rect(startX, startY, columnWidths[index], 10);
    //         doc.text(startX + 5, startY + 5, header);
    //         startX += columnWidths[index];
    //       });
    //       // Reset starting X position for the next row
    //       startX = (doc.internal.pageSize.width - totalWidth) / 2;
    //     };

    //     // Function to add table rows
    //     const addTableRows = () => {
    //       rows.forEach((row, rowIndex) => {
    //         row.forEach((cell, cellIndex) => {
    //           doc.rect(startX, startY + (rowIndex + 1) * 10, columnWidths[cellIndex], 10);
    //           doc.text(startX + 5, startY + (rowIndex + 1) * 10 + 5, cell);
    //           startX += columnWidths[cellIndex];
    //         });
    //         // Reset starting X position for the next row
    //         startX = (doc.internal.pageSize.width - totalWidth) / 2;
    //       });
    //     };

    //     // Function to add table total row
    //     const addTableTotalRow = () => {
    //       const totalRow = ['', 'TOTAL', '', '', ''];
    //       totalRow.forEach((cell, cellIndex) => {
    //         doc.rect(startX, startY + (rows.length + 1) * 10, columnWidths[cellIndex], 10);
    //         doc.text(startX + 5, startY + (rows.length + 1) * 10 + 5, cell);
    //         startX += columnWidths[cellIndex];
    //       });
    //       // Reset starting X position for the next row
    //       startX = (doc.internal.pageSize.width - totalWidth) / 2;
    //     };

    //     // Add table headers
    //     addTableHeaders();

    //     // Add table rows
    //     addTableRows();

    //     // Add table total row
    //     addTableTotalRow();

    //     // Save the PDF file
    //     doc.save('table_data.pdf');
    //   };


    const handlePdfDownload = () => {
        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = filteredDailysale.map(item => [
            item.titmcod,
            item.titmdsc,
            item.tpurrat,
            item.titmqnt,
            item.amount,
        ]);

        // Define table column headers and individual column widths
        const headers = ['Code', 'Description', 'Rate', 'Qty', 'Amount'];
        const columnWidths = [40, 120, 30, 20, 40];

        // Calculate total table width
        const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);



        // Define page height and padding
        const pageHeight = doc.internal.pageSize.height;
        const paddingTop = 20;
        const paddingBottom = 20;

        // Define starting Y position for the first page
        let startY = paddingTop;

        // Set font properties for the table
        doc.setFont("Verdana");
        doc.setFontSize(10);

        // Function to add table headers
        const addTableHeaders = (startX) => {
            // Set font style and size for headers
            doc.setFont('vardana'); // Set font to bold
            doc.setFontSize(12); // Set font size for headers

            headers.forEach((header, index) => {
                const cellWidth = columnWidths[index];
                const cellHeight = 6; // Height of the header row
                const cellX = startX + (cellWidth / 2); // Center the text horizontally
                const cellY = startY + (cellHeight / 2) + 2; // Center the text vertically

                // Draw the cell border
                doc.rect(startX, startY, cellWidth, cellHeight);

                // Set text alignment to center
                doc.setTextColor(0); // Set text color to black
                doc.text(cellX, cellY, header, null, null, 'center'); // Center the text
                startX += columnWidths[index]; // Move to the next column
            });

            // Reset font style and size after adding headers
            doc.setFont('vardana');
            doc.setFontSize(12);
        };



        // Function to add table rows for a page
        const addTableRows = (startX, endIndex) => {
            const rowHeight = 5; // Adjust this value to decrease row height
            const fontSize = 8; // Adjust this value to decrease font size
            doc.setFontSize(fontSize);
            for (let i = 2; i < endIndex; i++) { // Start from i = 1
                const row = rows[i - 2]; // Adjust the index to match the row data
                row.forEach((cell, cellIndex) => {
                    const cellY = startY + (i * rowHeight) + 3; // Adjust vertical position
                    doc.rect(startX, startY + (i * rowHeight), columnWidths[cellIndex], rowHeight);
                    doc.text(startX + 2, cellY, cell); // Adjust horizontal position
                    startX += columnWidths[cellIndex];
                });
                startX = (doc.internal.pageSize.width - totalWidth) / 2;
            }
        };



        // Function to add a new page and reset startY
        const addNewPage = () => {
            doc.addPage();
            startY = paddingTop; // Reset startY for new page
        };

        const addTotalRow = () => {
            let startX = (doc.internal.pageSize.width - totalWidth) / 2;
            const totalRate = rows.reduce((total, row) => total + parseFloat(row[2]), 0);
            const totalQty = rows.reduce((total, row) => total + parseFloat(row[3]), 0);
            const totalAmount = rows.reduce((total, row) => total + parseFloat(row[4]), 0);

            // Calculate the vertical position of the total row
            const totalRowY = startY + (rows.length * 5) + 3; // Assuming row height is 5, adjust as needed
            const totalRowHeight = 6; // Fixed height for the total row

            const totalRowData = ['', 'TOTAL', totalRate.toFixed(2), totalQty.toFixed(2), totalAmount.toFixed(2)];
            totalRowData.forEach((cell, cellIndex) => {
                doc.rect(startX, totalRowY, columnWidths[cellIndex], totalRowHeight);
                if (cellIndex === 1) {
                    doc.setFont('verdana', 'bold'); // Set font to Verdana and bold
                } else {
                    doc.setFont('verdana', 'normal'); // Set font to Verdana and normal
                }
                doc.text(startX + 5, totalRowY + 5, cell);
                startX += columnWidths[cellIndex];
            });
        };






        // Function to handle pagination
        const handlePagination = () => {
            let remainingRows = rows.length;
            let currentPageIndex = 0;

            while (remainingRows > 0) {
                addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2);
                const rowsPerPage = Math.floor((pageHeight - paddingTop - paddingBottom) / 10) - 2;
                const endIndex = Math.min(remainingRows, rowsPerPage);
                addTableRows((doc.internal.pageSize.width - totalWidth) / 2, endIndex);
                remainingRows -= rowsPerPage;
                if (remainingRows > 0) {
                    addNewPage();
                    currentPageIndex++;
                }
            }
        };

        // Call function to handle pagination
        handlePagination();

        // Add total row
        addTotalRow();

        // Save the PDF file
        doc.save('table_data.pdf');
    };




    const handleCsvDownload = () => {
        // Define table column headers
        const headers = ['Date', 'Description', 'Rate', 'Qty', 'Amount'];

        // Create CSV content
        let csvContent = headers.join(',') + '\n';

        // Add rows to CSV content
        filteredDailysale.forEach(item => {
            // const formattedDate = new Date(item.ttrndat).toLocaleDateString('en-US'); // Format the date column

            const row = [
                item.titmcod,
                `"${item.titmdsc}"`,
                item.tpurrat.toString(), // Convert to string to handle large numbers
                item.titmqnt.toString(),
                item.amount.toString() // Convert to string to handle large numbers
            ];

            const formattedRow = row.map(val => {
                // Handle special characters or formatting if needed for each column
                return isNaN(val) ? `"${val}"` : val; // Enclose non-numeric values in quotes
            });

            csvContent += formattedRow.join(',') + '\n';
        });

        // Calculate totals
        const totalSaleRate = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.tpurrat || 0), 0);
        const totalQuantity = filteredDailysale.reduce((acc, item) => acc + parseInt(item.titmqnt || 0), 0);
        const totalAmount = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);




        // Add a row with total values to CSV content
        const totalRow = [
            '', 'TOTAL',
            totalSaleRate.toString(),
            totalQuantity.toString(),
            totalAmount.toString()
        ];
        csvContent += totalRow.join(',') + '\n';

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


    // const handlePdfDownload = () => {
    //     // Create a new jsPDF instance with landscape orientation
    //     const doc = new jsPDF({ orientation: "landscape" });

    //     // Define table data (rows)
    //     const rows = filteredDailysale.map(item => [
    //       item.titmcod,
    //       item.titmdsc,
    //       item.tpurrat,
    //       item.titmqnt,
    //       item.amount,
    //     ]);

    //     // Define table column headers and individual column widths
    //     const headers = ['Code', 'Description', 'Rate', 'Qty', 'Amount'];
    //     const columnWidths = [40, 120, 30, 15, 40];

    //     // Calculate total table width
    //     const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

    //     // Calculate starting X position to horizontally center the table
    //     let startX = (doc.internal.pageSize.width - totalWidth) / 2;

    //     // Define starting Y position to vertically center the table
    //     const startY = (doc.internal.pageSize.height - (rows.length + 2) * 10) / 2;

    //     // Set font properties for the table
    //     doc.setFont("Verdana");
    //     doc.setFontSize(10);

    //     // Function to add table headers
    //     const addTableHeaders = () => {
    //       startX = (doc.internal.pageSize.width - totalWidth) / 2;
    //       headers.forEach((header, index) => {
    //         doc.rect(startX, startY, columnWidths[index], 10);
    //         doc.text(startX + 5, startY + 5, header);
    //         startX += columnWidths[index];
    //       });
    //     };

    //     // Function to add table rows
    //     const addTableRows = () => {
    //       startX = (doc.internal.pageSize.width - totalWidth) / 2;
    //       rows.forEach((row, rowIndex) => {
    //         row.forEach((cell, cellIndex) => {
    //           doc.rect(startX, startY + (rowIndex + 1) * 10, columnWidths[cellIndex], 10);
    //           doc.text(startX + 5, startY + (rowIndex + 1) * 10 + 5, cell);
    //           startX += columnWidths[cellIndex];
    //         });
    //         startX = (doc.internal.pageSize.width - totalWidth) / 2;
    //       });
    //     };

    //     // Function to add the total row
    //     const addTotalRow = () => {
    //       startX = (doc.internal.pageSize.width - totalWidth) / 2;
    //       const totalRate = rows.reduce((total, row) => total + parseFloat(row[2]), 0);
    //       const totalQty = rows.reduce((total, row) => total + parseFloat(row[3]), 0);
    //       const totalAmount = rows.reduce((total, row) => total + parseFloat(row[4]), 0);
    //       const totalRowData = ['', 'TOTAL', totalRate.toFixed(2), totalQty.toFixed(2), totalAmount.toFixed(2)];
    //       totalRowData.forEach((cell, cellIndex) => {
    //         doc.rect(startX, startY + (rows.length + 1) * 10, columnWidths[cellIndex], 10);
    //         doc.text(startX + 5, startY + (rows.length + 1) * 10 + 5, cell);
    //         startX += columnWidths[cellIndex];
    //       });
    //     };

    //     // Add table headers
    //     addTableHeaders();

    //     // Add table rows
    //     addTableRows();

    //     // Add total row
    //     addTotalRow();

    //     // Save the PDF file
    //     doc.save('table_data.pdf');
    //   };

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
                if (selectedTransactionType === 'INV') {
                    return item.ttrntyp === 'INV';
                } else if (selectedTransactionType === 'SRN') {
                    return item.ttrntyp === 'SRN';
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
    // const handleSaleTypeChange = (selectedSaleType) => {
    //   const filteredData = filterData(selectedSaleType, transectionType);
    //   setFilteredDailysale(filteredData);
    //   console.log("Filtered Data:", filteredData);
    // };

    // const handleTransactionTypeChange = (selectedTransactionType) => {
    //   const filteredData = filterData(saleType, selectedTransactionType);
    //   setFilteredDailysale(filteredData);
    //   console.log("Filtered Data:", filteredData);
    // };
    const handleSaleTypeChange = (event) => {
        const selectedSaleType = event.target.value;
        setSaleType(selectedSaleType);
    };
    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
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
    // Transforming fetched data into options array
    const Categoryoption = categoryData.map(item => ({
        value: item.tctgcod,
        label: `${item.tctgcod}-${item.tctgdsc.trim()}`
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
            marginLeft: 11,
        }),
        dropdownIndicator: base => ({
            ...base,
            padding: '5px',
        }),
    };

    const tablebgselectcolor = {
        backgroundColor: 'blue', cssText: 'backgroundcolor: blue !important'
    }

    //  Total of Amount, Quantity, SaleRate
    const totalAmount = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.amount.replace(/,/g, '') || 0), 0);
    const totalQuantity = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.titmqnt || 0), 0);
    const totalSaleRate = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.tpurrat.replace(/,/g, '') || 0), 0);

    // Format totals with commas
    const formattedTotalAmount = totalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 });
    const formattedTotalSaleRate = totalSaleRate.toLocaleString('en-US', { maximumFractionDigits: 2 });

    const handleSaleChange = (event) => {
        setSaleType(event.target.value); // Assuming 'setSaleType' is the function to update the state
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
                        Reports &nbsp;&gt;&nbsp; Item Reports &nbsp;&gt;&nbsp; Item Purchase Report
                    </p>
                </div>

            </header>

            <Container style={{ width: '750px', display: 'flex', justifyContent: 'center', border: '1px solid #cccccc' }} className="mt-2" >
                <div className="pt-2 pb-2">
                    <div className="parent ">
                        <div className="child1">


                            {/* From Date */}
                            <div className='d-flex align-items-center' >
                                <label htmlFor="fromDatePicker"><span style={{ fontSize: '10px' }}>From:</span>  <br /></label>
                                <div style={{
                                    width: '120px',
                                    border: '1px solid black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: ' 24px',
                                    justifycontent: 'center',
                                    marginLeft: '38px',
                                    background: 'white'

                                }}>
                                    <input
                                        style={{
                                            height: '20px',
                                            width: '90px',
                                            paddingLeft: '5px',
                                            outline: 'none',
                                            alignItems: 'center',
                                            // marginTop: '5.5px',
                                            border: 'none',
                                            fontSize: '10px'


                                        }}
                                        value={fromInputDate}
                                        ref={fromRef}
                                        onChange={handlefromInputChange}
                                        // onKeyPress={handlefromKeyPress}
                                        onKeyDown={(e) => handlefromKeyPress(e, 'toDatePicker')}
                                        // onKeyDown={(e) => handleKeyPressBoth(e, 'toDatePicker')}
                                        placeholder="dd-mm-yyyy"
                                        aria-label="Date Input"
                                        aria-describedby="datepicker"
                                    />
                                    <DatePicker
                                        selected={selectedfromDate}
                                        onChange={handlefromDateChange}
                                        dateFormat="dd-MM-yyyy"
                                        popperPlacement="bottom"
                                        showPopperArrow={false}
                                        showMonthDropdown
                                        showYearDropdown
                                        open={fromCalendarOpen}
                                        dropdownMode="select"
                                        customInput={
                                            <div  >
                                                <span >
                                                    <BsCalendar
                                                        onClick={toggleFromCalendar}
                                                        style={{
                                                            cursor: 'pointer',
                                                            alignItems: 'center',
                                                            marginLeft: '12px',
                                                            // marginTop: '5px',
                                                            fontSize: '12px'
                                                        }} />
                                                </span>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                            {/* To Date */}
                            <div style={{ marginLeft: '60px' }} className='d-flex align-items-center'>
                                <label htmlFor="toDatePicker"><span style={{ fontSize: '10px' }}>To:</span>  </label>
                                <div style={{
                                    width: '120px',
                                    border: '1px solid black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: ' 24px',
                                    justifycontent: 'center',
                                    marginLeft: '30px',
                                    background: 'white'

                                }} >
                                    <input
                                        style={{
                                            height: '20px',
                                            width: '90px',
                                            paddingLeft: '5px',
                                            outline: 'none',
                                            alignItems: 'center',
                                            // marginTop: '5.5px',
                                            border: 'none',
                                            fontSize: '10px'

                                        }} value={toInputDate}
                                        onChange={handleToInputChange}
                                        // onKeyPress={handleToKeyPress}
                                        onKeyDown={(e) => handleToKeyPress(e, 'submitButton')}
                                        // onKeyDown={(e) => handleKeyPressBoth(e, 'submitButton')}
                                        id="toDatePicker"
                                        placeholder="dd-mm-yyyy"
                                        aria-label="To Date Input"
                                        aria-describedby="todatepicker"
                                    />
                                    <DatePicker
                                        selected={selectedToDate}
                                        onChange={handleToDateChange}
                                        dateFormat="dd-MM-yyyy"
                                        popperPlacement="bottom"
                                        showPopperArrow={false}
                                        showMonthDropdown
                                        showYearDropdown
                                        open={toCalendarOpen}
                                        dropdownMode="select"
                                        customInput={
                                            <div>
                                                <span>
                                                    <BsCalendar
                                                        onClick={toggleToCalendar}
                                                        style={{
                                                            cursor: 'pointer',
                                                            alignItems: 'center',
                                                            marginLeft: '12px',
                                                            // marginTop: '5px',
                                                            fontSize: '12px'
                                                        }} />
                                                </span>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>

                            <div className="d-flex align-items-center" style={{ marginLeft: '50px' }}>
                                <label htmlFor="searchInput" style={{ paddingRight: '20px' }}><span style={{ fontSize: '10px' }}>Search:</span>  </label>
                                <input
                                    type="text"
                                    id="searchInput"
                                    placeholder="Item description"
                                    value={searchQuery}
                                    style={{ width: '150px', height: '24px', fontSize: '10px', border: '1px solid black', outline: 'none', paddingLeft: '10px' }}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                        </div>
                        <div className="child2 mt-1" >

                            <div className="d-flex align-itrms-center">
                                <label htmlFor="company" className="d-flex align-items-center"><span style={{ fontSize: '10px' }}>Company:</span></label>
                                <div className="company-select-class" style={{ marginLeft: '1px' }}>
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

                            <div className="d-flex align-itrms-center " id="lastDiv">
                                <label htmlFor="category" className="d-flex align-items-center"><span style={{ fontSize: '10px' }}>Category:</span></label>
                                <div className="company-select-class" style={{ marginLeft: '4px' }}>
                                    <Select
                                        className="List-select-class"
                                        options={Categoryoption}
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
                                        placeholder="Search or select..."
                                    />
                                </div>
                            </div>





                        </div>
                    </div>



                    <Row className="gap-3" >
                        {/* <div style={{ position:'relative' }}> */}
                        <MDBTable responsive striped scrollY maxHeight="570px" id='dailysale-table' className="MDB-table" >
                            <MDBTableHead style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}>
                                <tr>

                                    <th>Code</th>
                                    <th>Description</th>
                                    <th>Rate</th>
                                    <th>Qty</th>
                                    <th>Amount</th>

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
                                    filteredDailysale.map((item, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => handleRowClick(index)} // Add click event handler
                                            className={selectedIndex === index ? 'selected-row' : ''} // Apply 'selected-row' class based on selection
                                            style={{ cursor: 'pointer' }} // Add cursor pointer
                                        >
                                            <td style={{ width: '70px', textAlign: 'left' }}>{item.titmcod}</td>
                                            <td className='table-col-item-description' style={{ textAlign: 'left', cssText: 'text-align: left !important', width: '200px' }}>{item.titmdsc}</td>
                                            <td className='daily-salerat'>{item.tpurrat}</td>
                                            <td className='table-col-style' style={{ width: '30px' }}>{item.titmqnt}</td>
                                            <td className='daily-col-amount' >{item.amount}</td>
                                        </tr>
                                    ))
                                )}

                                {/* Fill remaining empty rows if data is less than 17 */}
                                {Array.from({ length: Math.max(24 - filteredDailysale.length, 0) }).map((_, rowIndex) => (
                                    <tr key={`empty-row-${rowIndex}`}>
                                        <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '80px' }}>&nbsp;</td>
                                        <td className={`table-col-item-description ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '200px' }}></td>
                                        <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '70px' }}></td>
                                        <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '30px' }}></td>
                                        <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '70px' }}></td>
                                    </tr>
                                ))}

                                {/* {Array.from({ length: Math.max(0, 17 - filteredDailysale.length) }).map((_, rowIndex) => (
    <tr key={`blank-${rowIndex}`}>
      {Array.from({ length: 8 }).map((_, colIndex) => (
        <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
      ))}
    </tr>
  ))} */}



                            </MDBTableBody>



                            {/* Render total row */}


                            <tr style={{ position: 'sticky', bottom: '0', backgroundColor: 'rgb(235, 135, 64)' }}>
                                <th className="itemslae-icon">
                                    <FontAwesomeIcon style={{ marginLeft: '10px' }} icon={faFilePdf} className="custom-icon " onClick={handlePdfDownload} title="Download PDF" />
                                    <FontAwesomeIcon style={{ marginLeft: '10px' }} icon={faFileCsv} className="custom-icon" onClick={handleCsvDownload} title="Download CSV" />
                                </th>
                                <th colSpan={1} style={{ textAlign: 'left !important' }}>TOTAL</th>
                                <th style={{ textAlign: 'right', cssText: 'text-align: right !important' }}>{formattedTotalSaleRate}</th>
                                <th>{totalQuantity}</th>
                                <th style={{ textAlign: 'right', cssText: 'text-align: right !important' }}>{formattedTotalAmount}</th>
                            </tr>



                        </MDBTable>



                        {/* </div> */}

                    </Row>

                    {/* <div className="iconsstyle">
            <FontAwesomeIcon icon={faFilePdf} className="custom-icon no-flex" onClick={handlePdfDownload} />
            <FontAwesomeIcon icon={faFileCsv} className="custom-icon no-flex" onClick={handleCsvDownload} />
          </div> */}

                </div>


            </Container >


        </div >
    );
}
