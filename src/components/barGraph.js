import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './common.css';

export default function BarGraph() {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const groupByMonth = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const dateObj = new Date(item.date);
      const monthYear = `${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getFullYear()}`;

      if (!grouped[monthYear]) {
        grouped[monthYear] = 0;
      }
      grouped[monthYear] += item.Amount;
    });

    const result = Object.entries(grouped).map(([month, Amount]) => ({
      date: month,
      amount: Amount,
    }));

    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post("http://localhost:8000/showData");
        if (res.data) {
          const formatted = groupByMonth(res.data);
          setDatas(formatted);
        } else {
          setError("No data received from the server.");
        }
      } catch (err) {
        console.error("Error fetching transaction history:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bar-graph-container" style={{marginTop:"180px"}}>
      <h2>Monthly Transaction Amounts</h2>
      {datas.length > 0 ? (
        <BarChart width={800} height={400} data={datas} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{ value: 'Month', position: 'bottom', offset: 30 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis label={{ value: 'Amount', angle: -90, position: 'left' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" name="Total Amount" />
        </BarChart>
      ) : (
        <p>No transaction data available.</p>
      )}
    </div>
  );
}