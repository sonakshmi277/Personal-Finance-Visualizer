import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./common.css";

export default function MainPg() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/getTransactionHistory", {
        Amount: formData.amount,
        Description: formData.description,
        date: formData.date,
      });
      setSuccessMessage("Saved successfully!");
      setErrorMessage(""); 
      setFormData({ amount: "", description: "", date: "" });
    } catch (err) {
      setErrorMessage("Error saving. Please try again.");
      setSuccessMessage(""); 
      console.log("Error:", err);
    }
  };
  

  return (
    <div className="main-page-container" style={{backgroundColor:"#210F37"}}>
      <aside className={`sidebar ${isCollapsed ? "" : "collapsed"}`}>
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? "☰" : "✖"}
        </button>
        {!isCollapsed && (
          <div className="menu-items">
            <h5 onClick={() => navigate('/')}>Home</h5>
            <h5 onClick={() => navigate('/transactionHis')}>View Transaction History</h5>
            <h5 onClick={() => navigate('/barGraph')}>Bar Graph</h5>
          </div>
        )}
      </aside>

      <main className="main-content">
        <h1 className="main-heading" style={{color:"#483d8b"}}>Personal Finance Visualizer</h1>
        <h2 style={{color:"#483d8b"}}>Add New Datas</h2>
        <form onSubmit={handleSubmit} className="input-form" style={{backgroundColor:"#C599B6", marginTop:"15px"}}>
          <div className="form-group">
            <label htmlFor="amount">Enter Amount Spent</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 12000"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Enter Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Groceries, Rent"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Enter Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button" style={{backgroundColor:"#210F37"}}>Submit</button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </main>
      
    </div>
  );
}