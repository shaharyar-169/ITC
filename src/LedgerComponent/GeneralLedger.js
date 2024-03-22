// import axios from "axios";
// import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
// import React, { useEffect, useState, useRef } from "react";
// import moment from "moment";
// import itc from '../itc.png'
// import { BsCalendar } from 'react-icons/bs'
// import { HiRefresh } from "react-icons/hi";
// import { FaCalendar, FaArrowLeft } from "react-icons/fa6";
// import { Container, Row, Spinner, Navbar, Button, Form } from "react-bootstrap";
// import { useNavigate } from 'react-router-dom'
// import Select from 'react-select';
// import { components } from 'react-select';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFilePdf, faFileCsv, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// // import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import 'jspdf-autotable'; // Import jspdf-autotable
// // import html2pdf from 'html2pdf';
// import DatePicker from 'react-datepicker';
// import '../dailysalereport.css';
// import 'react-datepicker/dist/react-datepicker.css';


// export default function GeneralLedgerReport() {
//   const [dailysale, setDailysale] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredDailysale, setFilteredDailysale] = useState([]);
//   const [submitClicked, setSubmitClicked] = useState(false);
//   const [saleType, setSaleType] = useState(null);
//   const [transectionType, settransectionType] = useState('All');
//   const [previousFilteredData, setpreviousFilteredData] = useState([])
//   const [showSpinner, setShowSpinner] = useState(true);
//   const [isloading, setisloading] = useState(false);
//   const [supplierList, setSupplierList] = useState([])

//   // state for from DatePicker
//   const [selectedfromDate, setSelectedfromDate] = useState(null);
//   const [fromInputDate, setfromInputDate] = useState('');
//   const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
//   // state for To DatePicker
//   const [selectedToDate, setSelectedToDate] = useState(null);
//   const [toInputDate, settoInputDate] = useState('');
//   const [toCalendarOpen, settoCalendarOpen] = useState(false);

//   const fromRef = useRef(null);
//   const saleSelectRef = useRef(null);
//   const typeSelectRef = useRef(null);

//   const nevigate = useNavigate();

//   const currentDate = moment().format("DD-MM-YYYY");


//   const handlefromDateChange = (date) => {
//     setSelectedfromDate(date);
//     setfromInputDate(date ? formatDate(date) : '');
//     setfromCalendarOpen(false);
//   };
//   const handlefromInputChange = (e) => {
//     setfromInputDate(e.target.value);
//   };
//   const handlefromKeyPress = (e, inputId) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       const formattedInput = fromInputDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3');
//       const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

//       if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
//         const [day, month, year] = formattedInput.split('-').map(Number);

//         if (month > 12 || month === 0) {
//           alert('Please enter a valid month (MM) between 01 and 12');
//           return;
//         }

//         const daysInMonth = new Date(year, month, 0).getDate();
//         if (day > daysInMonth || day === 0) {
//           alert(`Please enter a valid day (DD) for month ${month}`);
//           return;
//         }

//         const currentDate = new Date(); // Get the current date
//         const enteredDate = new Date(year, month - 1, day); // Month in JavaScript Date starts from 0 (0 - January, 1 - February, ...)

//         if (enteredDate > currentDate) {
//           alert(`From date cannot be greater than the To date.\n\nPlease enter the correct date in Format DD-MM-YYYY`);
//           return;
//         }

//         setfromInputDate(formattedInput);

//         const nextInput = document.getElementById(inputId);
//         console.log('Next input ID:', nextInput);
//         if (nextInput) {
//           nextInput.focus();
//           nextInput.select();
//         } else {
//           document.getElementById('submitButton').click(); // Trigger form submission
//         }
//       } else {
//         alert('Please enter a valid date in the format DD-MM-YYYY');

//       }
//     }
//   };
//   // Toggle the FromcalendarOpen state on each click
//   const toggleFromCalendar = () => {
//     setfromCalendarOpen(prevOpen => !prevOpen);
//   };
//   const handleToDateChange = (date) => {
//     setSelectedToDate(date);
//     settoInputDate(date ? formatDate(date) : '');
//     settoCalendarOpen(false);
//   };
//   const handleToInputChange = (e) => {
//     settoInputDate(e.target.value);
//   };
//   const handleToKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       const formattedInput = toInputDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3');
//       const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

//       if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
//         const [day, month, year] = formattedInput.split('-').map(Number);

//         if (month > 12 || month === 0) {
//           alert('Please enter a valid month (MM) between 01 and 12');
//           return;
//         }

//         const daysInMonth = new Date(year, month, 0).getDate();
//         if (day > daysInMonth || day === 0) {
//           alert(`Please enter a valid day (DD) for month ${month}`);
//           return;
//         }

//         const currentDate = new Date(); // Get the current date
//         const enteredDate = new Date(year, month - 1, day); // Month in JavaScript Date starts from 0 (0 - January, 1 - February, ...)

//         if (enteredDate > currentDate) {
//           alert(`To date cannot be greater than the current date.\n\nPlease enter the correct date in Format DD-MM-YYYY`);
//           return;
//         }

//         if (fromInputDate) {
//           const fromDate = new Date(fromInputDate.split('-').reverse().join('-'));
//           if (enteredDate <= fromDate) {
//             alert(`Todate cannot be smaller than or equal to the From date.\nPlease enter a valid Todate.`);
//             return;
//           }
//         }

//         settoInputDate(formattedInput);
//         if (saleSelectRef.current) {
//           e.preventDefault();
//           console.log('Selected value:', saleSelectRef); // Log the select value
//           saleSelectRef.current.focus(); // Move focus to React Select
//         } else {
//           // If saleSelectRef is not available, add logic here to focus on the next input/element
//         }

//       }
//     }
//   };

//   const handleSaleKeypress = (event, inputId) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       const nextInput = document.getElementById(inputId);
//       console.log('Next input ID:', nextInput);
//       if (nextInput) {
//         nextInput.focus();
//       } else {
//         document.getElementById('submitButton').click(); // Trigger form submission
//       }
//     }
//   };




//   const handleTypeKeypress = (event, inputId) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       const nextInput = document.getElementById(inputId);
//       console.log('Next input ID:', nextInput);

//       if (nextInput) {
//         nextInput.focus();
//       } else {
//         document.getElementById('submitButton').click(); // Trigger form submission
//       }
//     }
//   };

//   // Toggle the ToCalendarOpen state on each click
//   const toggleToCalendar = () => {
//     settoCalendarOpen(prevOpen => !prevOpen);
//   };
//   const formatDate = (date) => {
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const dashboardUrl = "https://crystalsolutions.com.pk/emart/web/GeneralLedger.php";


//   // function fecthing data for dailySales
//   const fetchDailysaleData = (fintdate, fnldate, code) => {
//     const data = new URLSearchParams({ fintdate, fnldate, code }).toString();

//     axios.post(dashboardUrl, data, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     })
//       .then((response) => {
//         setDailysale(response.data);
//         setFilteredDailysale(response.data)
//         setpreviousFilteredData(response.data)
//         console.log('dailysale sale data', response.data);

//         // Apply filters based on sale and transaction types AFTER data is fetched
//         const filteredData = filterData(saleType, transectionType, response.data);
//         setFilteredDailysale(filteredData);
//         setpreviousFilteredData(response.data)
//         console.log('filtered dailysale data', response.data);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         // Log the error and inspect the response to diagnose the issue.
//       });
//   };


//   useEffect(() => {
//     const hasComponentMountedPreviously = sessionStorage.getItem('componentMounted');
//     // If it hasn't mounted before or on refresh, select the 'from date' input
//     if (!hasComponentMountedPreviously || (fromRef && fromRef.current)) {
//       if (fromRef && fromRef.current) {
//         setTimeout(() => {
//           fromRef.current.focus(); // Focus on the input field
//           fromRef.current.select(); // Select the text within the input field
//         }, 0);
//       }
//       sessionStorage.setItem('componentMounted', 'true'); // Set the flag indicating mount
//     }


//   }, []);

//   useEffect(() => {
//     const currentDate = new Date();
//     setSelectedToDate(currentDate);
//     settoInputDate(formatDate(currentDate));

//     const firstDateOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     setSelectedfromDate(firstDateOfCurrentMonth);
//     setfromInputDate(formatDate(firstDateOfCurrentMonth));

//     fetchDailysaleData(formatDate(firstDateOfCurrentMonth), formatDate(currentDate), saleType);
//   }, []); // Make sure to include saleType in the dependency array




//   const handleSubmit = (event) => {
//     event.preventDefault();

//     if (fromInputDate && toInputDate && saleType) {
//       // Fetch data based on date range
//       fetchDailysaleData(fromInputDate, toInputDate, saleType);
//       setSubmitClicked(true);
//     } else {
//       // Handle case when dates are not selected
//       alert('Please select From date ,To dates And status');
//     }
//   };

//   const handlebackSubmit = (event) => {
//     event.preventDefault();
//     nevigate('/MainPage');

//   };

//   useEffect(() => {
//     if (submitClicked) {
//       // fetchDailysaleData(formatDate(fromInputDate), formatDate(toInputDate));
//       fetchDailysaleData(fromInputDate, toInputDate, saleType);

//       setSubmitClicked(false);
//     }
//   }, [submitClicked]);

//   // code for search filter
//   useEffect(() => {
//     if (searchQuery === '') {
//       // If search query is cleared, show previous data or original data
//       if (previousFilteredData.length > 0) {
//         setFilteredDailysale(previousFilteredData);
//       } else {
//         setFilteredDailysale(filteredDailysale);
//       }
//       return;
//     }

//     // Filter the data based on the current search query
//     const filteredData = filteredDailysale.filter(item => {
//       // Filter based on the search query if it's not empty
//       if (searchQuery !== '') {
//         return item.ttrndsc && item.ttrndsc.toLowerCase().includes(searchQuery.toLowerCase());
//       }
//       return true;
//     })

//     if (filteredData.length === 0) {
//       // If no results for the current query, revert to previous data based on the query
//       const prevFilteredByQuery = previousFilteredData.filter((item) => {
//         const itemDesc = item.ttrndsc ? item.ttrndsc.toLowerCase() : '';
//         return itemDesc.includes(searchQuery.toLowerCase());

//       });
//       setFilteredDailysale(prevFilteredByQuery);
//     } else {
//       // Display matching rows for the current query
//       setFilteredDailysale(filteredData);
//     }
//   }, [searchQuery]);

//   const handlePdfDownload = () => {
//     const doc = new jsPDF();

//     // Define table column headers
//     const headers = ['Date', 'Ref#', 'Description', 'Rate', 'Quantity', 'Debit', 'Credit', 'Balance'];
//     // Define table rows from the table body
//     const rows = filteredDailysale.map(item => [
//       item.ttrndat,
//       item.ttrntyp,
//       item.ttrndsc,
//       item.rate,
//       item.titmqnt,
//       item.debit,
//       item.credit,
//       item.balance,
//     ]);

//     // Set the font size to 10
//     doc.setFontSize(5);

//     // Add table headers and rows
//     doc.autoTable({
//       head: [headers],
//       body: rows,
//       startY: 10 // Adjust the starting Y position for the table
//     });


//     // Modify the totalRow array to place values in respective columns
//     const totalRow = ['TOTAL', '', '', '', '', '', '', ''];
//     const totalRowIndex = doc.autoTable.previous.finalY + 10; // Adjust the Y position for the total row

//     doc.autoTable({
//       body: [totalRow],
//       startY: totalRowIndex,
//       didDrawCell: (data) => {
//         if (data.column.index === 3) {
//           doc.text(totalQuantity.toString(), data.cell.x + 2, data.cell.y + data.cell.height / 2);
//         } else if (data.column.index === 5) {
//           doc.text(formattedTotalDebit !== undefined ? formattedTotalDebit.toString() : '', data.cell.x + 2, data.cell.y + data.cell.height / 2);
//         } else if (data.column.index === 6) {
//           doc.text(formattedTotalCredit !== undefined ? formattedTotalCredit.toString() : '', data.cell.x + 2, data.cell.y + data.cell.height / 2);
//         } else if (data.column.index === 7) {
//           doc.text(formattedTotalBalance !== undefined ? formattedTotalBalance.toString() : '', data.cell.x + 2, data.cell.y + data.cell.height / 2);
//         }
//       }
//     });

//     // Save the PDF
//     doc.save('table_data.pdf');
//   };
//   const handleCsvDownload = () => {
//     // Define table column headers
//     const headers = ['Date', 'Ref#', 'Description', 'Rate', 'Quantity', 'Debit', 'Credit', 'Balance'];

//     // Create CSV content
//     let csvContent = headers.join(',') + '\n';

//     // Add rows to CSV content
//     filteredDailysale.forEach(item => {
//       const row = [
//         item.ttrndat,
//         item.ttrntyp,
//         item.ttrndsc, // Ensure numeric values are converted to strings
//         item.rate,
//         item.titmqnt.toString(),
//         item.debit.toString(),
//         item.credit.toString(),
//         item.balance.toString()
//       ];

//       const formattedRow = row.map(val => {
//         // Handle special characters or formatting if needed for each column
//         return isNaN(val) ? `"${val}"` : val; // Enclose non-numeric values in quotes
//       });

//       csvContent += formattedRow.join(',') + '\n';
//     });

//     // Calculate totals
//     const totalSaleRate = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.debit || 0), 0);
//     const totalQuantity = filteredDailysale.reduce((acc, item) => acc + parseInt(item.credit || 0), 0);
//     const totalAmount = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.balance || 0), 0);

//     // Add a row with total values to CSV content
//     const totalRow = [
//       'TOTAL', '', '', '', '',
//       totalSaleRate.toString(),
//       totalQuantity.toString(),
//       totalAmount.toString()
//     ];
//     csvContent += totalRow.join(',') + '\n';

//     // Create a Blob containing the CSV data
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

//     // Create a URL from the Blob
//     const url = URL.createObjectURL(blob);

//     // Create a link element and trigger the download
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'table_data.csv');
//     document.body.appendChild(link);
//     link.click();

//     // Clean up
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };
//   const filterData = (selectedSaleType, selectedTransactionType, data) => {
//     let filteredData = [...data];
//     if (selectedSaleType !== 'All') {
//       filteredData = filteredData.filter((item) => {
//         if (selectedSaleType === 'cash') {
//           return item.trefcod && item.trefcod.startsWith('12');
//         } else if (selectedSaleType === 'credit') {
//           return !item.trefcod || !item.trefcod.startsWith('12');
//         }
//         return true; // For 'All', return all data
//       });
//     }

//     if (selectedTransactionType !== 'All') {
//       filteredData = filteredData.filter((item) => {
//         if (selectedTransactionType === 'INV') {
//           return item.ttrntyp === 'INV';
//         } else if (selectedTransactionType === 'SRN') {
//           return item.ttrntyp === 'SRN';
//         }
//         return true; // For 'All', return all data
//       });
//     }

//     return filteredData;
//   };


//   // const handleSaleTypeChange = (selectedSaleType) => {
//   //   const filteredData = filterData(selectedSaleType, transectionType);
//   //   setFilteredDailysale(filteredData);
//   //   console.log("Filtered Data:", filteredData);
//   // };

//   // const handleTransactionTypeChange = (selectedTransactionType) => {
//   //   const filteredData = filterData(saleType, selectedTransactionType);
//   //   setFilteredDailysale(filteredData);
//   //   console.log("Filtered Data:", filteredData);
//   // };



//   const handleSaleTypeChange = (selectedOption) => {
//     setSaleType(selectedOption.value);
//     // Perform any additional actions if needed
//   };

//   console.log(saleType)


//   const handleTransactionTypeChange = (event) => {
//     const selectedTransactionType = event.target.value;
//     settransectionType(selectedTransactionType);
//   };
//   //Add this function inside your DailySaleReport component
//   // Add this function inside your DailySaleReport component
//   const handleShortcutKeyPress = (event) => {
//     // Check if the event matches the specific shortcut (Alt+S)
//     if (event.altKey && event.key === 'r') {
//       event.preventDefault();  // Close the default browser behavior

//       // Trigger the click event on the submit button
//       const submitButton = document.getElementById('submitButton');
//       if (submitButton) {
//         submitButton.click();
//         submitButton.focus();

//       }

//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       // event.preventDefault();
//       if (event.altKey && event.key === 's') {
//         event.preventDefault();
//         handlebackSubmit(event);
//       }
//       //  else if (event.altKey && event.key === 's') {
//       //   handlebackSubmit(event);
//       // }
//     };

//     document.addEventListener('keydown', handleKeyDown);

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//     };
//   }, []);



//   // Add event listener to detect key presses
//   useEffect(() => {
//     window.addEventListener('keydown', handleShortcutKeyPress);
//     return () => {
//       window.removeEventListener('keydown', handleShortcutKeyPress);
//     };
//   }, []);


//   useEffect(() => {
//     const spinnerTimeout = setTimeout(() => {
//       setShowSpinner(false); // Hide the spinner after 3 seconds
//     }, 500); // 3000 milliseconds (3 seconds)

//     // Clear the timeout when the component unmounts or the dependency changes
//     return () => clearTimeout(spinnerTimeout);
//   }, []);



//   //  Total of Amount, Quantity, SaleRate

//   const totalQuantity = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.titmqnt.replace(/,/g, '') || 0), 0);
//   const totaldebit = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.debit.replace(/,/g, '') || 0), 0);
//   const totalcredit = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.credit || 0), 0);
//   const totalbalance = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.balance.replace(/,/g, '') || 0), 0);


//   // Format totals with commas
//   const formattedTotalBalance = totalbalance.toLocaleString('en-US', { maximumFractionDigits: 2 });
//   const formattedTotalDebit = totaldebit.toLocaleString('en-US', { maximumFractionDigits: 2 });
//   const formattedTotalCredit = totalcredit.toLocaleString('en-US', { maximumFractionDigits: 2 });



//   useEffect(() => {
//     const apiUrl = 'https://crystalsolutions.com.pk/emart/web/CustomerCodeList.php';
//     axios.post(apiUrl)
//       .then(response => {
//         setSupplierList(response.data);
//         console.log(supplierList);
//         // setSaleType(response.data[0]?.tacccod || ''); // Set default value to the tacccod of the first object in supplierList
//         console.log(saleType)
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   // Transforming fetched data into options array
//   const options = supplierList.map(item => ({
//     value: item.tacccod,
//     label: `${item.tacccod}-${item.taccdsc.trim()}`
//   }));

//   const DropdownOption = (props) => {
//     return (
//       <components.Option {...props}>
//         <div style={{ borderBottom: '1px solid #ccc', fontSize: '10px', padding: '0', margin: '0', width: 'auto' }}>
//           {props.data.label}
//         </div>
//       </components.Option>
//     );
//   };

//   const customStyles = {
//     control: (base, state) => ({
//       ...base,
//       height: '24px',
//       minHeight: 'unset',
//       width: 250,
//       borderRadius: 0,
//       border: '1px solid black',
//       transition: 'border-color 0.15s ease-in-out',
//       '&:hover': {
//         borderColor: state.isFocused ? base.borderColor : 'black',
//       },
//       padding: '0 8px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       marginLeft: 25,
//     }),
//     dropdownIndicator: base => ({
//       ...base,
//       padding: '5px',
//     }),
//   };

//   return (
//     <div>
//       <Navbar
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           borderBottom: "1px solid #ccc",
//           height: '40px'
//         }}>
//         <div style={{
//           flex: "1",
//           marginRight: "1rem",
//           position: 'relative',
//         }}>

//           <img src={itc} alt="Logo" style={{ maxWidth: "50px", marginLeft: '10px' }} />
//           <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '0' }}>
//             <p style={{ margin: '0', textAlign: 'center' }}>{currentDate}</p>
//           </div>
//         </div>
//       </Navbar>
//       <header
//         style={
//           {
//             width: '100%',
//             height: '30px',
//             backgroundColor: '#003B73',
//             display: 'flex',
//             // justifyContent:'center',
//             alignItems: 'center'
//           }}>
//         <div style={{ marginLeft: '40px', cursor: 'pointer', color: 'white', fontSize: '22px', display: 'flex', alignItems: 'center' }}>
//           <Form onSubmit={handlebackSubmit}>
//             <Button
//               id="handlebackSubmit"
//               type="submit"
//               // className="btn btn-outline-primary"
//               variant="outline-primary"
//               style={{
//                 height: '32px',
//                 display: 'flex',
//                 alignItems: 'center',

//               }}
//             >
//               <FaArrowLeft style={{ color: 'white', fontSize: '23px' }} />
//             </Button>
//           </Form>        </div>

//         <div
//           style={{
//             marginLeft: '30px',
//             cursor: 'pointer', color:
//               'white', fontSize: '22px',
//             display: 'flex', alignItems: 'center'
//           }}>

//           <Form onSubmit={handleSubmit}>
//             <Button
//               id="submitButton"
//               type="submit"
//               // className="btn btn-outline-primary"
//               variant="outline-primary"
//               style={{
//                 height: '32px',
//                 display: 'flex',
//                 alignItems: 'center'
//               }}
//             >
//               <HiRefresh style={{ color: 'white', fontSize: '23px' }} />
//             </Button>
//           </Form>


//         </div>

//         <div style={{ marginLeft: '60px', marginRight: '20px' }}>
//           <p style={{ margin: '0', fontFamily: 'Sans-serif', fontWeight: '700', fontSize: '15px', lineHeight: '1', textAlign: 'left', color: 'white' }}>
//             Reports &nbsp;&gt;&nbsp; Daily Reports &nbsp;&gt;&nbsp; General Ledger Report
//           </p>
//         </div>

//       </header>

//       <Container style={{ height: '640px', width: '1200px', display: 'flex', justifyContent: 'center', border: '1px solid #cccccc' }} className="mt-3 ">
//         <div className="mt-2">
//           <div className="parent ">
//           <div className="child1" style={{ marginBottom: '5px' }}>
//               {/* From Date */}
//               <div className='d-flex align-items-center' >
//                 <label htmlFor="fromDatePicker"><span style={{ fontSize: '10px' }}>From:</span>  <br /></label>
//                 <div style={{
//                   width: '135px',
//                   border: '1px solid black',
//                   display: 'flex',
//                   alignItems: 'center',
//                   height: ' 24px',
//                   justifycontent: 'center',
//                   marginLeft: '47px',
//                   background: 'white'

//                 }}>
//                   <input
//                     style={{
//                       height: '20px',
//                       width: '90px',
//                       paddingLeft: '5px',
//                       outline: 'none',
//                       alignItems: 'center',
//                       // marginTop: '5.5px',
//                       border: 'none',
//                       fontSize: '10px'


//                     }}
//                     value={fromInputDate}
//                     ref={fromRef}
//                     onChange={handlefromInputChange}
//                     // onKeyPress={handlefromKeyPress}
//                     onKeyDown={(e) => handlefromKeyPress(e, 'toDatePicker')}
//                     // onKeyDown={(e) => handleKeyPressBoth(e, 'toDatePicker')}
//                     placeholder="dd-mm-yyyy"
//                     aria-label="Date Input"
//                     aria-describedby="datepicker"
//                   />
//                   <DatePicker
//                     selected={selectedfromDate}
//                     onChange={handlefromDateChange}
//                     dateFormat="dd-MM-yyyy"
//                     popperPlacement="bottom"
//                     showPopperArrow={false}
//                     showMonthDropdown
//                     showYearDropdown
//                     open={fromCalendarOpen}
//                     dropdownMode="select"
//                     customInput={
//                       <div  >
//                         <span >
//                           <BsCalendar
//                             onClick={toggleFromCalendar}
//                             style={{
//                               cursor: 'pointer',
//                               alignItems: 'center',
//                               marginLeft: '18px',
//                               // marginTop: '5px',
//                               fontSize: '12px'
//                             }} />
//                         </span>
//                       </div>
//                     }
//                   />
//                 </div>
//               </div>

//               {/* To Date */}
//               <div style={{ marginLeft: '219px' }} className='d-flex align-items-center'>
//                 <label htmlFor="toDatePicker"><span style={{ fontSize: '12px' }}>To:</span>  </label>
//                 <div style={{
//                   width: '135px',
//                   border: '1px solid black',
//                   display: 'flex',
//                   alignItems: 'center',
//                   height: ' 24px',
//                   justifycontent: 'center',
//                   marginLeft: '39px',
//                   background: 'white'

//                 }} >
//                   <input
//                     style={{
//                       height: '20px',
//                       width: '90px',
//                       paddingLeft: '5px',
//                       outline: 'none',
//                       alignItems: 'center',
//                       // marginTop: '5.5px',
//                       border: 'none',
//                       fontSize: '10px'

//                     }} value={toInputDate}
//                     onChange={handleToInputChange}
//                     // onKeyPress={handleToKeyPress}
//                     onKeyDown={(e) => handleToKeyPress(e, 'submitButton')}
//                     // onKeyDown={(e) => handleKeyPressBoth(e, 'submitButton')}
//                     id="toDatePicker"
//                     placeholder="dd-mm-yyyy"
//                     aria-label="To Date Input"
//                     aria-describedby="todatepicker"
//                   />
//                   <DatePicker
//                     selected={selectedToDate}
//                     onChange={handleToDateChange}
//                     dateFormat="dd-MM-yyyy"
//                     popperPlacement="bottom"
//                     showPopperArrow={false}
//                     showMonthDropdown
//                     showYearDropdown
//                     open={toCalendarOpen}
//                     dropdownMode="select"
//                     customInput={
//                       <div>
//                         <span>
//                           <BsCalendar
//                             onClick={toggleToCalendar}
//                             style={{
//                               cursor: 'pointer',
//                               alignItems: 'center',
//                               marginLeft: '18px',
//                               // marginTop: '5px',
//                               fontSize: '12px'
//                             }} />
//                         </span>
//                       </div>
//                     }
//                   />
//                 </div>
//               </div>

//             </div>


//             <div className="child2" >

//               <div className="d-flex align-items-center" >
//                 <label htmlFor="Status" ><span style={{ fontSize: '12px' }}>Status:</span></label>
//                 <div style={{ marginLeft: '3px' }}>
//                   {/* <Select
//                     className="status-select-styling"
//                     // style={{height:'35px', cssText:'height 35px !important'}} 
//                     ref={saleSelectRef}
//                     options={options}
//                     onKeyDown={(e) => handleSaleKeypress(e, 'selectedtype')}
//                     id="selectedsale"
//                     name="status"
//                     value={options.find((opt) => opt.value === saleType)}
//                     onChange={(selectedOption) => {
//                       if (selectedOption && selectedOption.value) {
//                         setSaleType(selectedOption.value);
//                       }
//                     }}
//                     components={{ Option: DropdownOption }}
//                     formatOptionLabel={(optionData) => <div>{optionData.label}</div>}
//                     styles={customStyles}

//                   /> */}
//                   <Select
//                     className="List-select-class"
//                     ref={saleSelectRef}
//                     options={options}
//                     onKeyDown={(e) => handleSaleKeypress(e, 'selectedtype')}
//                     id="selectedsale"
//                     onChange={(selectedOption) => {
//                       if (selectedOption && selectedOption.value) {
//                         setSaleType(selectedOption.value);
//                       }
//                     }}
//                     components={{ Option: DropdownOption }}
//                     styles={customStyles}
//                     isClearable
//                     placeholder="Search or select..."
//                   />
//                 </div>


//               </div>

//               <div className="d-flex align-items-center" >
//                 <label htmlFor="type"  ><span style={{ fontSize: '10px' }}>Type:</span></label>
//                 <select
//                   ref={typeSelectRef}
//                   onKeyDown={(e) => handleTypeKeypress(e, 'submitButton')}
//                   id="selectedtype"
//                   name="type"
//                   value={transectionType}
//                   onChange={handleTransactionTypeChange}
//                   // onChange={(e) => {
//                   //   settransectionType(e.target.value);
//                   //   handleTransactionTypeChange(e.target.value);
//                   // }}
//                   style={{
//                     width: '135px',
//                     height: '24px',
//                     marginLeft: '27px',
//                     textAlign: 'center',
//                     background: 'white',
//                     border: '1px solid black',
//                     fontSize: '10px'

//                   }}>
//                   <option value="All">All</option>
//                   <option value="INV">INV</option>
//                   <option value="SRN">SRN</option>
//                 </select>



//               </div>

//             <div id="lastDiv">
//                 <label for="searchInput" style={{ marginRight: '20px' }}><span style={{ fontSize: '10px' }}>Search:</span> </label>
//                 <input
//                   type="text"
//                   id="searchInput"
//                   placeholder="Item description"
//                   value={searchQuery}
//                   style={{ width: '250px', height: '24px', fontSize: '10px', border: '1px solid black', outline: 'none', paddingLeft: '10px' }}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>



//             </div>



//             <Row className="gap-3">
//               <MDBTable responsive scrollY striped bordered maxHeight="550px" id='dailysale-table' >
//                 <MDBTableHead style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}>
//                   <tr>
//                     {/* <th >#</th> */}
//                     <th>Date</th>
//                     <th>Ref#</th>
//                     <th>Description</th>
//                     <th>Rate</th>
//                     <th>Qty</th>
//                     <th>Debit</th>
//                     <th>Credit</th>
//                     <th>Balance</th>

//                   </tr>
//                 </MDBTableHead>
//                 <MDBTableBody id="dailysale-table" className='scrollable-body' >
//                   {/* Conditionally render the Spinner or the data */}
//                   {showSpinner ? (
//                     <div
//                       style={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                       }}
//                     >
//                       <Spinner animation="border" variant="primary" />
//                     </div>
//                   ) : (
//                     filteredDailysale
//                       .map((item, index) => (
//                         <tr key={index}>
//                           <td className='table-col-style' style={{ width: '110px' }}>{item.ttrndat}</td>
//                           <td className='table-col-style' style={{ width: '110px' }}>{item.ttrntyp}</td>
//                           <td className='table-col-item-description' style={{ textAlign: 'left', cssText: 'text-align: left !important', width: '320px' }}>{item.ttrndsc}</td>
//                           <td className='table-col-style' style={{ width: '100px' }}>{item.rate}</td>
//                           <td className='table-col-style' style={{ width: '80px' }}>{item.titmqnt}</td>
//                           <td className='table-col-style' style={{ width: '100px' }}>{item.debit}</td>
//                           <td className='table-col-style' style={{ width: '100px' }}>{item.credit}</td>
//                           <td className='supplier-col-amount' style={{ textAlign: 'right', cssText: 'text-align: right !important' }}>{item.balance}</td>
//                         </tr>
//                       ))
//                   )}


//                   {Array.from({ length: Math.max(24 - filteredDailysale.length, 0) }).map((_, rowIndex) => (
//                     <tr key={`empty-row-${rowIndex}`}>
//                       <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '110px' }}>&nbsp;</td>
//                       <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '110px' }}></td>
//                       <td className={`table-col-item-description ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ textAlign: 'left', cssText: 'text-align: left !important', width: '320px' }}></td>
//                       <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '100px' }}></td>
//                       <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '80px' }}></td>
//                       <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '100px' }}></td>
//                       <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '100px' }} ></td>
//                       <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{width:'120px '}}> </td>

//                     </tr>
//                   ))}

//                   {/* {Array.from({ length: Math.max(0, 17 - filteredDailysale.length) }).map((_, rowIndex) => (
//                   <tr key={`blank-${rowIndex}`}>
//                     {Array.from({ length: 8 }).map((_, colIndex) => (
//                       <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
//                     ))}
//                   </tr>
//                 ))} */}


//                 </MDBTableBody>

//                 <tr style={{ position: "sticky", bottom: 0, backgroundColor: "rgb(235, 135, 64)", marginTop: '2px', }}>
//                   <th className="icon-container">
//                     <FontAwesomeIcon icon={faFilePdf} className="custom-icon" onClick={handlePdfDownload} title="Download PDF" />
//                     <FontAwesomeIcon icon={faFileCsv} className="custom-icon" onClick={handleCsvDownload} title="Download CSV" />
//                   </th>
//                   <th colSpan={3}>TOTAL</th>
//                   <th>{totalQuantity}</th>
//                   <th>{formattedTotalDebit}</th>
//                   <th>{formattedTotalCredit}</th>
//                   <th style={{ textAlign: 'right', cssText: 'text-align: right !important' }}>{formattedTotalBalance}</th>
//                 </tr>

//               </MDBTable>
//             </Row>
//             {/* 
//             <div className="iconsstyle">
//               <FontAwesomeIcon icon={faFilePdf} className="custom-icon no-flex" onClick={handlePdfDownload} />
//               <FontAwesomeIcon icon={faFileCsv} className="custom-icon no-flex" onClick={handleCsvDownload} />
//             </div> */}
//           </div>
//         </div >
//       </Container >
//     </div >
//   );
// }


import axios from "axios";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import itc from '../itc.png'
import { BsCalendar } from 'react-icons/bs'
import { HiRefresh } from "react-icons/hi";
import { FaCalendar, FaArrowLeft } from "react-icons/fa6";
import { Container, Row, Spinner, Navbar, Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'
import Select from 'react-select';
import { components } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileCsv, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import 'jspdf-autotable'; // Import jspdf-autotable
// import html2pdf from 'html2pdf';
import DatePicker from 'react-datepicker';
import '../dailysalereport.css';
import 'react-datepicker/dist/react-datepicker.css';


export default function GeneralLedgerReport() {
  const [dailysale, setDailysale] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDailysale, setFilteredDailysale] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [saleType, setSaleType] = useState('');
  const [transectionType, settransectionType] = useState('All');
  const [previousFilteredData, setpreviousFilteredData] = useState([])
  const [showSpinner, setShowSpinner] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [supplierList, setSupplierList] = useState([])

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
  const handleToKeyPress = (e) => {
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
        if (saleSelectRef.current) {
          e.preventDefault();
          console.log('Selected value:', saleSelectRef); // Log the select value
          saleSelectRef.current.focus(); // Move focus to React Select
        } else {
          // If saleSelectRef is not available, add logic here to focus on the next input/element
        }

      }
    }
  };

  // const handleSaleKeypress = (event, inputId) => {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     const nextInput = document.getElementById(inputId);
  //     console.log('Next input ID:', nextInput);
  //     if (nextInput) {
  //       nextInput.focus();
  //     } else {
  //       document.getElementById('submitButton').click(); // Trigger form submission
  //     }
  //   }
  // };


  const handleSaleKeypress = (event, inputId) => {
    if (event.key === 'Enter') {
      setTimeout(() => { // Ensure this code runs after the default behavior
        if (saleType) {
          const nextInput = document.getElementById(inputId);
          if (nextInput) {
            nextInput.focus(); // Move focus to the next input
          } else {
            document.getElementById('submitButton').click(); // Trigger form submission
          }
        }
      }, 0);
    }
  };






  const handleTypeKeypress = (event, inputId) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const nextInput = document.getElementById(inputId);
      console.log('Next input ID:', nextInput);

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

  const dashboardUrl = "https://crystalsolutions.com.pk/emart/web/GeneralLedger.php";


  // function fecthing data for dailySales
  const fetchDailysaleData = (fintdate, fnldate, code) => {
    setShowSpinner(true)
    const data = new URLSearchParams({ fintdate, fnldate, code: code }).toString();

    axios.post(dashboardUrl, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        setDailysale(response.data);
        setFilteredDailysale(response.data)
        setpreviousFilteredData(response.data)
        console.log('dailysale sale data', response.data);
        setShowSpinner(false);

        // Apply filters based on sale and transaction types AFTER data is fetched
        const filteredData = filterData(saleType, transectionType, response.data);
        setFilteredDailysale(filteredData);
        setpreviousFilteredData(response.data)
        console.log('filtered dailysale data', response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Log the error and inspect the response to diagnose the issue.
      });
  };
  useEffect(() => {
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


  }, []);

  useEffect(() => {
    const currentDate = new Date();
    setSelectedToDate(currentDate);
    settoInputDate(formatDate(currentDate));

    const firstDateOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    setSelectedfromDate(firstDateOfCurrentMonth);
    setfromInputDate(formatDate(firstDateOfCurrentMonth));

    fetchDailysaleData(formatDate(firstDateOfCurrentMonth), formatDate(currentDate), saleType);
  }, []); // Make sure to include saleType in the dependency array

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   if (fromInputDate && toInputDate && saleType) {
  //     // Fetch data based on date range
  //     fetchDailysaleData(fromInputDate, toInputDate, saleType);
  //     setSubmitClicked(true);
  //   } else {
  //     // Handle case when dates are not selected
  //     alert('Please select From date ,To dates And status');
  //   }
  // };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    fetchDailysaleData(fromInputDate, toInputDate, saleType);
    setSubmitClicked(true);
  }

  const handlebackSubmit = (event) => {
    event.preventDefault();
    nevigate('/MainPage');

  };

  useEffect(() => {
    if (submitClicked) {
      // fetchDailysaleData(formatDate(fromInputDate), formatDate(toInputDate), saleType);
      fetchDailysaleData(fromInputDate, toInputDate, saleType);

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
        return item.ttrndsc && item.ttrndsc.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })

    if (filteredData.length === 0) {
      // If no results for the current query, revert to previous data based on the query
      const prevFilteredByQuery = previousFilteredData.filter((item) => {
        const itemDesc = item.ttrndsc ? item.ttrndsc.toLowerCase() : '';
        return itemDesc.includes(searchQuery.toLowerCase());

      });
      setFilteredDailysale(prevFilteredByQuery);
    } else {
      // Display matching rows for the current query
      setFilteredDailysale(filteredData);
    }
  }, [searchQuery]);

  const handlePdfDownload = () => {
    const doc = new jsPDF();

    // Define table column headers
    const headers = ['Date', 'Ref#', 'Description', 'Rate', 'Quantity', 'Debit', 'Credit', 'Balance'];
    // Define table rows from the table body
    const rows = filteredDailysale.map(item => [
      item.ttrndat,
      item.ttrntyp,
      item.ttrndsc,
      item.rate,
      item.titmqnt,
      item.debit,
      item.credit,
      item.balance,
    ]);

    // Set the font size to 10
    doc.setFontSize(5);

    // Add table headers and rows
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 10 // Adjust the starting Y position for the table
    });


    // Modify the totalRow array to place values in respective columns
    const totalRow = ['TOTAL', '', '', '', '', '', '', ''];
    const totalRowIndex = doc.autoTable.previous.finalY + 10; // Adjust the Y position for the total row

    doc.autoTable({
      body: [totalRow],
      startY: totalRowIndex,
      didDrawCell: (data) => {
        if (data.column.index === 3) {
          doc.text(totalQuantity.toString(), data.cell.x + 2, data.cell.y + data.cell.height / 2);
        } else if (data.column.index === 5) {
          doc.text(formattedTotalDebit !== undefined ? formattedTotalDebit.toString() : '', data.cell.x + 2, data.cell.y + data.cell.height / 2);
        } else if (data.column.index === 6) {
          doc.text(formattedTotalCredit !== undefined ? formattedTotalCredit.toString() : '', data.cell.x + 2, data.cell.y + data.cell.height / 2);
        } else if (data.column.index === 7) {
          doc.text(formattedTotalBalance !== undefined ? formattedTotalBalance.toString() : '', data.cell.x + 2, data.cell.y + data.cell.height / 2);
        }
      }
    });

    // Save the PDF
    doc.save('table_data.pdf');
  };
  const handleCsvDownload = () => {
    // Define table column headers
    const headers = ['Date', 'Ref#', 'Description', 'Rate', 'Quantity', 'Debit', 'Credit', 'Balance'];

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    // Add rows to CSV content
    filteredDailysale.forEach(item => {
      const row = [
        item.ttrndat,
        item.ttrntyp,
        item.ttrndsc, // Ensure numeric values are converted to strings
        item.rate,
        item.titmqnt.toString(),
        item.debit.toString(),
        item.credit.toString(),
        item.balance.toString()
      ];

      const formattedRow = row.map(val => {
        // Handle special characters or formatting if needed for each column
        return isNaN(val) ? `"${val}"` : val; // Enclose non-numeric values in quotes
      });

      csvContent += formattedRow.join(',') + '\n';
    });

    // Calculate totals
    const totalSaleRate = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.debit || 0), 0);
    const totalQuantity = filteredDailysale.reduce((acc, item) => acc + parseInt(item.credit || 0), 0);
    const totalAmount = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.balance || 0), 0);

    // Add a row with total values to CSV content
    const totalRow = [
      'TOTAL', '', '', '', '',
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
  const filterData = (selectedSaleType, selectedTransactionType, data) => {
    let filteredData = [...data];
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





  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };
  //Add this function inside your DailySaleReport component
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
  //   const spinnerTimeout = setTimeout(() => {
  //     setShowSpinner(false); // Hide the spinner after 3 seconds
  //   }, 500); // 3000 milliseconds (3 seconds)

  //   // Clear the timeout when the component unmounts or the dependency changes
  //   return () => clearTimeout(spinnerTimeout);
  // }, []);



  //  Total of Amount, Quantity, SaleRate

  const totalQuantity = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.titmqnt.replace(/,/g, '') || 0), 0);
  const totaldebit = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.debit.replace(/,/g, '') || 0), 0);
  const totalcredit = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.credit || 0), 0);
  const totalbalance = filteredDailysale.reduce((acc, item) => acc + parseFloat(item.balance.replace(/,/g, '') || 0), 0);


  // Format totals with commas
  const formattedTotalBalance = totalbalance.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const formattedTotalDebit = totaldebit.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const formattedTotalCredit = totalcredit.toLocaleString('en-US', { maximumFractionDigits: 2 });



  useEffect(() => {
    // const apiUrl = 'https://crystalsolutions.com.pk/iqbaltrader/SupplierList.php';
    const apiUrl = 'https://crystalsolutions.com.pk/iqbaltrader/web/ChartOfAccount.php';
    axios.post(apiUrl)
      .then(response => {
        setSupplierList(response.data);
        // console.log("supplierList data"+ supplierList);
        // setSaleType(response.data[0]?.tacccod || ''); // Set default value to the tacccod of the first object in supplierList
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Transforming fetched data into options array
  const options = supplierList.map(item => ({
    value: item.tacccod,
    label: `${item.tacccod}-${item.taccdsc.trim()}`
  }));

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
      width: 250,
      fontSize: '10px',
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
      padding: 0,
      fontSize: '18px',
      display: 'flex',
      textAlign: 'center !important',
    }),
  };

  console.log("supplierList data" + supplierList);
  console.log("saletypedata" + saleType);

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
          </Form>        </div>

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
            Reports &nbsp;&gt;&nbsp; Ledgers &nbsp;&gt;&nbsp; General Ledger Report
          </p>
        </div>

      </header>

      <Container style={{ width: '1040px', display: 'flex', justifyContent: 'center', border: '1px solid #cccccc', paddingLeft: '20px', paddingRight: '20px' }} className="mt-2 ">

        <div className="pt-2 pb-2">
          <div className="parent ">
            <div className="child1" style={{ marginBottom: '5px' }}>
              {/* From Date */}
              <div className='d-flex align-items-center' >
                <label htmlFor="fromDatePicker"><span style={{ fontSize: '10px' }}>From:</span>  <br /></label>
                <div style={{
                  width: '135px',
                  border: '1px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  height: ' 24px',
                  justifycontent: 'center',
                  marginLeft: '45px',
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
                              marginLeft: '18px',
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
              <div style={{ marginLeft: '202px' }} className='d-flex align-items-center'>
                <label htmlFor="toDatePicker"><span style={{ fontSize: '10px' }}>To:</span>  </label>
                <div style={{
                  width: '135px',
                  border: '1px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  height: ' 24px',
                  justifycontent: 'center',
                  marginLeft: '39px',
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
                              marginLeft: '18px',
                              // marginTop: '5px',
                              fontSize: '12px'
                            }} />
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>

            </div>


            <div className="child2" >

              <div className="d-flex align-items-center" >
                <label htmlFor="Status" ><span style={{ fontSize: '10px' }}>Status:</span></label>
                <div style={{ marginLeft: '3px' }}>

                  {/* <Select
                    className="List-select-class"
                    ref={saleSelectRef}
                    options={options}
                    onKeyDown={(e) => handleSaleKeypress(e, 'submitButton')}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        setSaleType(selectedOption.value);
                      }
                    }}
                    components={{ Option: DropdownOption }}
                    styles={customStyles}
                    isClearable
                    placeholder="Search or select..."
                  /> */}

                  <Select
                    className="List-select-class"
                    ref={saleSelectRef}
                    options={options}
                    onKeyDown={(e) => handleSaleKeypress(e, 'submitButton')}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        setSaleType(selectedOption.value);
                      } else {
                        setSaleType(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                      }
                    }}
                    components={{ Option: DropdownOption }}
                    styles={customStyles}
                    isClearable
                    placeholder="Search or select..."
                  />


                </div>


              </div>

              <div className="d-flex align-items-center" >
                <label htmlFor="type"  ><span style={{ fontSize: '10px' }}>Type:</span></label>
                <select
                  ref={typeSelectRef}
                  onKeyDown={(e) => handleTypeKeypress(e, 'submitButton')}
                  id="selectedtype"
                  name="type"
                  value={transectionType}
                  onChange={handleTransactionTypeChange}
                  // onChange={(e) => {
                  //   settransectionType(e.target.value);
                  //   handleTransactionTypeChange(e.target.value);
                  // }}
                  style={{
                    width: '135px',
                    height: '24px',
                    marginLeft: '27px',
                    textAlign: 'center',
                    background: 'white',
                    border: '1px solid black',
                    fontSize: '10px'

                  }}>
                  <option value="All">All</option>
                  <option value="INV">INV</option>
                  <option value="SRN">SRN</option>
                </select>



              </div>

              <div id="lastDiv">
                <label for="searchInput" style={{ marginRight: '20px' }}><span style={{ fontSize: '10px' }}>Search:</span> </label>
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Item description"
                  value={searchQuery}
                  style={{ width: '250px', height: '24px', fontSize: '10px', border: '1px solid black', outline: 'none', paddingLeft: '10px' }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>



            </div>



            <Row >
              <MDBTable responsive scrollY striped bordered maxHeight="550px" id='dailysale-table' className="MDB-table" >
                <MDBTableHead style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}>
                  <tr className="Table-head-style">
                    <th>Date</th>
                    <th>Ref#</th>
                    <th>Description</th>
                    <th>Rate</th>
                    <th>Qty</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Balance</th>

                  </tr>
                </MDBTableHead>
                <MDBTableBody id="dailysale-table" className='scrollable-body' >
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
                          <td className='table-col-style' style={{ width: '110px' }}>{item.ttrndat}</td>
                          <td className='table-col-style' style={{ width: '110px' }}>{item.ttrntyp}</td>
                          <td className='table-col-item-description' style={{ textAlign: 'left', cssText: 'text-align: left !important', width: '320px' }}>{item.ttrndsc}</td>
                          <td className='table-col-style' style={{ width: '100px' }}>{item.rate}</td>
                          <td className='table-col-style' style={{ width: '80px' }}>{item.titmqnt}</td>
                          <td className='table-col-style' style={{ width: '100px' }}>{item.debit}</td>
                          <td className='table-col-style' style={{ width: '100px' }}>{item.credit}</td>
                          <td className='supplier-col-amount' style={{ textAlign: 'right', cssText: 'text-align: right !important' }}>{item.balance}</td>
                        </tr>
                      ))
                  )}


                  {Array.from({ length: Math.max(24 - filteredDailysale.length, 0) }).map((_, rowIndex) => (
                    <tr key={`empty-row-${rowIndex}`}>
                      <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '110px' }}>&nbsp;</td>
                      <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '110px' }}></td>
                      <td className={`table-col-item-description ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ textAlign: 'left', cssText: 'text-align: left !important', width: '320px' }}></td>
                      <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '100px' }}></td>
                      <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '80px' }}></td>
                      <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '100px' }}></td>
                      <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{ width: '100px' }} ></td>
                      <td className={`table-col-style ${filteredDailysale.length === 0 ? 'empty-style' : ''}`} style={{width:'120px '}}> </td>

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


                <tr style={{ position: "sticky", bottom: 0, fontSize: '10px', backgroundColor: "rgb(235, 135, 64)", marginTop: '2px', }}>
                  <th className="icon-container">
                    {/* <button style={{color:'black', background:'none', fontSize:'12px '}}>PDF Download</button> */}

                    <FontAwesomeIcon icon={faFilePdf} className="custom-icon" onClick={handlePdfDownload} title="Download PDF" />
                    <FontAwesomeIcon icon={faFileCsv} className="custom-icon" onClick={handleCsvDownload} title="Download CSV" />
                  </th>
                  <th colSpan={3} >TOTAL</th>
                  <th>{totalQuantity}</th>
                  <th>{formattedTotalDebit}</th>
                  <th>{formattedTotalCredit}</th>
                  <th style={{ textAlign: 'right', cssText: 'text-align: right !important' }}>{formattedTotalBalance}</th>
                </tr>

              </MDBTable>
            </Row>
            {/* 
            <div className="iconsstyle">
              <FontAwesomeIcon icon={faFilePdf} className="custom-icon no-flex" onClick={handlePdfDownload} />
              <FontAwesomeIcon icon={faFileCsv} className="custom-icon no-flex" onClick={handleCsvDownload} />
            </div> */}
          </div>
        </div >
      </Container >
    </div >
  );
}


