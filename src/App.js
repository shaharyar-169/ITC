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
import {ThemeProvider} from  './ThemeContext'
import CustomerLedgerReport from './LedgerComponent/customerLedger';
 



function App() {
  return (
    <>
      <div style={{ backgroundColor: '#edf2ff', minHeight: '100vh' }}>

        <Router >
          <ThemeProvider>
            <Routes>
              <Route exact path="/iqbaltrader/itc" element={<Login />} />
              <Route exact path="/login" element={<Login />}></Route>
              <Route exact path="/MainPage" element={< HomePage1/>}></Route>
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
              <Route exact path="/ItemsaleReport" element={<ItemSaleReport/>}></Route>
              <Route exact path="/ItempurchaseReport" element={<ItemPurchaseReport/>}></Route>
              <Route exact path="/Cash&BankReport" element={<CashBankBalanceRepoert/>}></Route>
              <Route exact path="/ItemStockReport" element={<ItemStockReport/>}></Route>
              <Route exact path="/EmployeeList" element={<EmployeeListReport/>}></Route>
              <Route exact path="/ItemstatusReport" element={<ItemStatusReport/>}></Route>
              <Route exact path="/ItemmarginReport" element={<ItemMarginReport/>}></Route>
              <Route exact path="/SlowmovingReport" element={<SlowMovingitemReport/>}></Route>


            </Routes>
          </ThemeProvider>
          
        </Router>

        

      </div>
    </>
  );
}

export default App;











