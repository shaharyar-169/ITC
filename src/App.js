import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage1 from './Component/MainComponent/HomePage/Homepage';
import Login from './Component/MainComponent/Login/Login';
import DailySaleReport from './dailysaleReport';
import DailypurchaseReport from './dailypurchaseReport';
import DailyStockStatusReport from './dailyStockStatusReport';
import SupplierLedgerReport from './LedgerComponent/supplierledger'
import PriceListReport from './Component/Listcomponent/priceList';
import CompanyListReort from './Component/Listcomponent/companyList';
import CategoryListReport from './Component/Listcomponent/categoryList';
import ChartOfAccountList from './Component/Listcomponent/chartofAccounyList';
import LocationList from './Component/Listcomponent/location';
import ItemListReport from './Component/Listcomponent/itemListReport';
import GeneralLedgerReport from './LedgerComponent/GeneralLedger';
import ItemLedgerReport from './LedgerComponent/ItemLedger';
import ItemSaleReport from './ItemReportcomponent/ItemSaleReport';
import ItemPurchaseReport from './ItemReportcomponent/ItemPurchaseRepor';
import CashBankBalanceRepoert from './Cash&BankReport';
import ItemStockReport from './ItemReportcomponent/ItemStockReport';
import EmployeeListReport from './Component/Listcomponent/employeelist';
import ItemStatusReport from './ItemReportcomponent/itemstatusreports';
import ItemMarginReport from './ItemReportcomponent/itemmarginreport';
import SlowMovingitemReport from './ItemReportcomponent/slowmovingReport';
import { ThemeProvider } from './ThemeContext'
import CustomerLedgerReport from './LedgerComponent/customerLedger';

// mr sohaib code 
import Customer_Maintenance from './Component/File/Customer_Maintenance/Customer_Maintenance';
import Get_Area from './Component/File/Area_Maintenance/Get_Area';
import Add_Area from './Component/File/Area_Maintenance/Add_Area';
import Update_Area from './Component/File/Area_Maintenance/Update_Area';
import Get_Group from './Component/File/Group_maintenance/Get_Group';
import Add_Group from './Component/File/Group_maintenance/Add_Group';
import Update_Group from './Component/File/Group_maintenance/Updat_Group';
import Get_Collector from './Component/File/collector_Maintenance/Get_Collector';
import Add_Collector from './Component/File/collector_Maintenance/Add_Collector';
import Update_Collector from './Component/File/collector_Maintenance/Updat_Collector';
import Get_Verifier from './Component/File/Verify_maintenance/Get_Verifier';
import Add_Verifier from './Component/File/Verify_maintenance/Add_Verifier';
import Update_Verifier from './Component/File/Verify_maintenance/Update_Verifier';


function App() {
  return (
    <>
      <div style={{ backgroundColor: '#edf2ff', minHeight: '100vh' }}>

        <Router >
          <ThemeProvider>
            <Routes>
              <Route exact path="/iqbaltrader/itc" element={<Login />} />
              <Route exact path="/login" element={<Login />}></Route>
              <Route exact path="/MainPage" element={< HomePage1 />}></Route>
              <Route exact path="/DailySaleReport" element={<DailySaleReport />}></Route>
              <Route exact path="/DailyPurchaseReport" element={<DailypurchaseReport />}></Route>
              <Route exact path="/DailyStockStatusReport" element={<DailyStockStatusReport />}></Route>
              <Route exact path="/SupplierLedgerReport" element={<SupplierLedgerReport />}></Route>
              <Route exact path="/CustomerLedgerReport" element={<CustomerLedgerReport />}></Route>
              <Route exact path="/PriceListReport" element={<PriceListReport />}></Route>
              <Route exact path="/CompanyListReport" element={<CompanyListReort />}></Route>
              <Route exact path="/CategoryListReport" element={<CategoryListReport />}></Route>
              <Route exact path="/ChartOfAccountList" element={<ChartOfAccountList />}></Route>
              <Route exact path="/LocationList" element={<LocationList />}></Route>
              <Route exact path="/ItemListReport" element={<ItemListReport />}></Route>
              <Route exact path="/ItemListReport" element={<ItemListReport />}></Route>
              <Route exact path="/GeneralLegerReport" element={<GeneralLedgerReport />}></Route>
              <Route exact path="/ItemLegerReport" element={<ItemLedgerReport />}></Route>
              <Route exact path="/ItemsaleReport" element={<ItemSaleReport />}></Route>
              <Route exact path="/ItempurchaseReport" element={<ItemPurchaseReport />}></Route>
              <Route exact path="/Cash&BankReport" element={<CashBankBalanceRepoert />}></Route>
              <Route exact path="/ItemStockReport" element={<ItemStockReport />}></Route>
              <Route exact path="/EmployeeList" element={<EmployeeListReport />}></Route>
              <Route exact path="/ItemstatusReport" element={<ItemStatusReport />}></Route>
              <Route exact path="/ItemmarginReport" element={<ItemMarginReport />}></Route>
              <Route exact path="/SlowmovingReport" element={<SlowMovingitemReport />}></Route>


              {/* ///////////////////////////////// file  /////////////////////////////// */}

              <Route exact path="/Customer_Maintenance" element={<Customer_Maintenance />}></Route>
              {/* ///////////////////////////////// area maintenece  /////////////////////////////// */}
              <Route exact path="/Get_Area" element={<Get_Area />}></Route>
              <Route exact path="/Add_Area" element={<Add_Area />}></Route>
              <Route exact path="/Update_Area/:tareid" element={<Update_Area />}></Route>
              {/* ///////////////////////////////// groyp maintenece  /////////////////////////////// */}
              <Route exact path="/Get_Group" element={<Get_Group />}></Route>
              <Route exact path="/Add_Group" element={<Add_Group />}></Route>
              <Route exact path="/Update_Group/:tgrpid" element={<Update_Group />}></Route>
              {/* ///////////////////////////////// collector maintenece  /////////////////////////////// */}
              <Route exact path="/Get_Collector" element={<Get_Collector />}></Route>
              <Route exact path="/Add_Collector" element={<Add_Collector />}></Route>
              <Route exact path="/Update_Collector/:id" element={<Update_Collector />}></Route>

              {/* ///////////////////////////////// verified maintenece  /////////////////////////////// */}

              <Route exact path="/Get_Verifier" element={<Get_Verifier />}></Route>
              <Route exact path="/Add_Verifier" element={<Add_Verifier />}></Route>
              <Route exact path="/Update_Verifier/:id" element={<Update_Verifier />}></Route>

            </Routes>
          </ThemeProvider>

        </Router>



      </div>
    </>
  );
}

export default App;











