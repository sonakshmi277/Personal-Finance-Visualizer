import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionHis from "./components/transactionHis";
import MainPg from "./components/mainPg";
import BarGraph from "./components/barGraph";
import Dashboard from './components/dashboard';
import PieChartt from "./components/pieChart";
function App() {
  
  return(
  <Router>
        <Routes>
            <Route path="/" element={<MainPg />} />
            <Route path="/transactionHis" element={<TransactionHis />} />
            <Route path="/barGraph" element={<BarGraph/>}/>
            <Route path="dashboard" element={<Dashboard/>}/>
            <Route path="pieChart" element={<PieChartt/>}/>
        </Routes>
      </Router>
  );
}
export default App;
