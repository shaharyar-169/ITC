import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './menu.css';
import {useNavigate} from 'react-router-dom';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({});
  const [activeItem, setActiveItem] = useState(null);

  const navigate = useNavigate();
  //const history=useHistory();

  const handleMenuItemClick = (menuItem) => {
    const routeMapping = {
      "3-02-07": "/DailyPurchaseReport",
      "3-02-05": "/DailyStockStatusReport",
      "3-09-00": "/DailySaleReport",
      "3-03-05": "/SupplierLedgerReport",
    };

    const route = routeMapping[menuItem.tmencod];
    console.log('Clicked Item:', menuItem.tmencod);

    if (route) {
      console.log('Navigating to Route:', route);
      navigate(route);
    } else {
      console.error(`Route not found for tmencod: ${menuItem.tmencod}`);
    }
  };
  

  useEffect(() => {
    fetchMenuItems(33);
  }, []);
  function fetchMenuItems(userID) {
    const apiUrl = `https://crystalsolutions.com.pk/iqbaltrader/get_usrmenu.php`;
    const data = {
      userid: userID,
    };
    const formData = new URLSearchParams(data).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setMenuItems(response.data);
        console.log(response.data)

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Function to toggle dropdown visibility
  const toggleDropdown = (index) => {
    setDropdownStates((prevState) => {
      const updatedState = { ...prevState };
  
      // Close all other top-level menus except the clicked one
      Object.keys(updatedState).forEach((key) => {
        if (key !== `${index}`) {
          updatedState[key] = false;
        }
      });
  
      // Toggle the clicked top-level menu
      updatedState[index] = !prevState[index] || false;
      return updatedState;
    });
  };

  // const toggleSubSubMenu = (parentIdx, subIdx) => {
  //   setDropdownStates((prevState) => ({
  //     ...prevState,
  //     [`${parentIdx}-${subIdx}`]: !prevState[`${parentIdx}-${subIdx}`] || false,
  //   }));
  // };
  

    // Function to toggle sub-submenu visibility
    // const toggleSubSubMenu = (parentIdx, subIdx) => {
    //   setDropdownStates((prevState) => {
    //     const updatedState = {};
  
    //     // Close all sub-submenus except the clicked one
    //     Object.keys(prevState).forEach((key) => {
    //       if (key !== `${parentIdx}-${subIdx}`) {
    //         updatedState[key] = false;
    //       }
    //     });
  
    //     // Toggle the clicked submenu
    //     updatedState[`${parentIdx}-${subIdx}`] = !prevState[`${parentIdx}-${subIdx}`] || false;
    //     return updatedState;
    //   });
    // };

      // Function to toggle sub-submenu visibility
       const toggleSubSubMenu = (parentIdx, subIdx, isSubSubMenu) => {
    setDropdownStates((prevState) => {
      const updatedState = { ...prevState };

      if (!isSubSubMenu && !updatedState[parentIdx]) {
        // If a top-level menu is closed, close any selected sub-submenu
        Object.keys(updatedState).forEach((key) => {
          if (key.startsWith(`${parentIdx}-`)) {
            updatedState[key] = false;
          }
        });
      }

      if (isSubSubMenu) {
        // Close other unrelated sub-submenus
        Object.keys(updatedState).forEach((key) => {
          if (key.startsWith(`${parentIdx}-`) && key !== `${parentIdx}-${subIdx}`) {
            updatedState[key] = false;
          }
        });
      } else {
        // Close all sub-submenus except the clicked submenu
        Object.keys(updatedState).forEach((key) => {
          if (key.startsWith(`${parentIdx}-`) && key !== `${parentIdx}-${subIdx}`) {
            updatedState[key] = false;
          }
        });
      }

      // Toggle the clicked submenu or sub-submenu
      updatedState[`${parentIdx}-${subIdx}`] = !updatedState[`${parentIdx}-${subIdx}`] || false;
      return updatedState;
    });
  }
 

  
  const organizeMenuItems = () => {
    const headerMenu = {};

    const sortedMenuItems = [...menuItems].sort((a, b) => {
      const codeA = a.tmencod;
      const codeB = b.tmencod;

      return codeA.localeCompare(codeB); // Sort based on tmencod in ascending order
    });

    sortedMenuItems.forEach((item) => {
      const [left, center, right] = item.tmencod.split('-');

      if (!headerMenu[left]) {
        headerMenu[left] = {
          label: item.tmendsc,
          subdropdowns: {},
        };
      }

      if (center !== '00') {
        if (!headerMenu[left].subdropdowns[center]) {
          headerMenu[left].subdropdowns[center] = {
            label: item.tmendsc,
            subsubdropdowns: [],
          };
        }

        if (right !== '00') {
          headerMenu[left].subdropdowns[center].subsubdropdowns.push({
            label: item.tmendsc,
          });
        }
      }
    });


    return headerMenu;
  };
  const headerMenu = organizeMenuItems();


  const renderSubDropdown = (subDropdowns, parentIdx) => {
    const sortedSubItems = Object.values(subDropdowns).sort((a, b) => {
      const codeA = parseInt(Object.keys(subDropdowns).find((key) => subDropdowns[key] === a));
      const codeB = parseInt(Object.keys(subDropdowns).find((key) => subDropdowns[key] === b));

      return codeA - codeB; // Sort based on center value of tmencod
    });

    //   return sortedSubItems.map((subItem, idx) => (
    //     <li key={idx}>
    //       {subItem.label}
    //       {subItem.subsubdropdowns.length > 0 && (
    //         <ul>{renderSubSubDropdown(subItem.subsubdropdowns)}</ul>
    //       )}
    //     </li>
    //   ));
    // };

    //   return sortedSubItems.map((subItem, idx) => (
    //     <li key={idx} className={`sub-menu-item-${parentIdx + 1}-${idx + 1}`}> 
    //       {subItem.label}
    //       {subItem.subsubdropdowns.length > 0 && (
    //         <ul className={`sub-sub-dropdown-${parentIdx + 1}-${idx + 1}`}>{renderSubSubDropdown(subItem.subsubdropdowns, parentIdx, idx)}</ul> 
    //       )}
    //     </li>
    //   ));
    // };

  //   return sortedSubItems.map((subItem, idx) => (
  //     <li
  //       key={idx}
  //       className={`sub-menu-item-${parentIdx + 1}-${idx + 1}`}
  //       onClick={() => toggleSubSubMenu(parentIdx, idx, false)} // Indicate it's a submenu click
  //     >
  //       {subItem.label}
  //       {subItem.subsubdropdowns.length > 0 && (
  //         <ul
  //           className={`sub-sub-dropdown-${parentIdx + 1}-${idx + 1}`}
  //           style={{ display: dropdownStates[`${parentIdx}-${idx}`] ? 'block' : 'none' }}
  //         >
  //           {/* Rendering sub-submenu items */}
  //           {renderSubSubDropdown(subItem.subsubdropdowns, parentIdx, idx)}
  //         </ul>
  //       )}
  //     </li>
  //   ));
  // };

  return sortedSubItems.map((subItem, idx) => (
    <li
      key={idx}
      className={`sub-menu-item-${parentIdx + 1}-${idx + 1} ${dropdownStates[`${parentIdx}-${idx}`] ? 'active' : ''}`}
      onClick={() => {
        const newState = !dropdownStates[`${parentIdx}-${idx}`];
        toggleSubSubMenu(parentIdx, idx, false);
        handleMenuItemClick(subItem); // Handle menu item click
        setDropdownStates(prevState => ({
          ...prevState,
          [`${parentIdx}-${idx}`]: newState,
        }));
      }}
    >
      {subItem.label}
      {subItem.subsubdropdowns.length > 0 && (
        <ul
          className={`sub-sub-dropdown-${parentIdx + 1}-${idx + 1}`}
          style={{ display: dropdownStates[`${parentIdx}-${idx}`] ? 'block' : 'none' }}
        >
          {renderSubSubDropdown(subItem.subsubdropdowns, parentIdx, idx)}
        </ul>
      )}
    </li>
  ));
}; 



  // code for unskipe first item in all subsubdropdown 
  //   const renderSubDropdown = (subDropdowns) => {
  //     const sortedSubItems = Object.values(subDropdowns).sort((a, b) => {
  //       const codeA = parseInt(Object.keys(subDropdowns).find((key) => subDropdowns[key] === a));
  //       const codeB = parseInt(Object.keys(subDropdowns).find((key) => subDropdowns[key] === b));

  //       return codeA - codeB; // Sort based on center value of tmencod
  //     });

  //     return sortedSubItems.map((subItem, idx) => {
  //       const subsubItems = [...subItem.subsubdropdowns].sort((a, b) => {
  //         const codeA = parseInt(Object.keys(subItem.subsubdropdowns).find((key) => subItem.subsubdropdowns[key] === a));
  //         const codeB = parseInt(Object.keys(subItem.subsubdropdowns).find((key) => subItem.subsubdropdowns[key] === b));
  //         return codeA - codeB; // Sort based on center value of tmencod
  //       });

  //       return (
  //         <li key={idx}>
  //           {subItem.label}
  //           {subsubItems.length > 0 && (
  //             <ul>
  //               {subsubItems.map((subsubItem, subIdx) => (
  //                 <li key={subIdx}>{subsubItem.label}</li>
  //               ))}
  //             </ul>
  //           )}
  //         </li>
  //       );
  //     });
  //   };



  // const renderSubSubDropdown = (subSubDropdowns) => {
  //     const itemsToRender = subSubDropdowns.slice(1); // Exclude the first item
  //     return itemsToRender.map((subSubItem, idx) => (
  //       <li key={idx}>{subSubItem.label}</li>
  //     ));
  //   };

  const renderSubSubDropdown = (subSubDropdowns, parentIdx, subIdx) => {
    return subSubDropdowns.slice(1).map((subSubItem, idx) => (
      <li key={idx} className={`sub-sub-menu-item-${parentIdx + 1}-${subIdx + 1}-${idx + 1}`}>
       {/* <Link to={tmencodRoutes[subSubItem.tmencod]}></Link> */}
     <span  onClick={() => handleMenuItemClick(subSubItem)}></span>
     
      
       {subSubItem.label}
      </li>
    ));
  };


  // const renderDropdown = () => {
  //   return Object.values(headerMenu).map((item, idx) => (
  //     <li key={idx}>
  //       {item.label}
  //       {Object.keys(item.subdropdowns).length > 0 && (
  //         <ul>{renderSubDropdown(item.subdropdowns)}</ul>
  //       )}
  //     </li>
  //   ));
  // };

  // const renderDropdown = () => {
  //   return Object.values(headerMenu).map((item, idx) => (
  //     <li key={idx} className={`top-menu-item-${idx + 1}`}> 
  //       {item.label}
  //       {Object.keys(item.subdropdowns).length > 0 && (
  //         <ul className={`sub-dropdown-${idx + 1}`}>{renderSubDropdown(item.subdropdowns, idx)}</ul> 
  //       )}
  //     </li>
  //   ));
  // };

  // const renderDropdown = () => {
  //   return Object.values(headerMenu).map((item, idx) => (
  //     <li
  //       key={idx}
  //       className={`top-menu-item-${idx + 1} ${activeItem === idx ? 'active' : ''}`}
  //     >
  //       <span onClick={() => handleDropdownClick(idx)}>{item.label}</span>
  
  //       {Object.keys(item.subdropdowns).length > 0 && (
  //         <ul
  //           className={`sub-dropdown-${idx + 1}`}
  //           style={{ display: dropdownStates[`${idx}`] ? 'block' : 'none' }}
  //         >
  //           {renderSubDropdown(item.subdropdowns, idx)}
  //         </ul>
  //       )}
  //     </li>
  //   ));
  // };

  const renderDropdown = () => {
    return Object.values(headerMenu).map((item, idx) => (
      <li
        key={idx}
        className={`top-menu-item-${idx + 1} ${activeItem === idx ? 'active' : ''}`}
      >
        <span onClick={() => handleDropdownClick(idx)}>{item.label}</span>

        {Object.keys(item.subdropdowns).length > 0 && (
          <ul
            className={`sub-dropdown-${idx + 1}`}
            style={{ display: dropdownStates[`${idx}`] ? 'block' : 'none' }}
          >
            {renderSubDropdown(item.subdropdowns, idx)}
          </ul>
        )}
      </li>
    ));
  };

  const handleDropdownClick = (idx) => {
    toggleDropdown(`${idx}`);
    setActiveItem(activeItem === idx ? null : idx);
  };
    
 



  return (
    <div className="menu-container">
      <ul className="menu">
        {renderDropdown()}
      </ul>
    </div>
  );
}

