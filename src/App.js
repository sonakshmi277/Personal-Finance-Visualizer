import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionHis from "./components/transactionHis";
import MainPg from "./components/mainPg";
import BarGraph from "./components/barGraph";
function App() {
  
  return(
  <Router>
        <Routes>
            <Route path="/" element={<MainPg />} />
            <Route path="/transactionHis" element={<TransactionHis />} />
            <Route path="/barGraph" element={<BarGraph/>}/>
        </Routes>
      </Router>
  );
}
export default App;
