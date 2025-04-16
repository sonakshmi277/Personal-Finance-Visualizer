import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './common.css';

export default function TransactionHis() {
  const [datas, setDatas] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editFormData, setEditFormData] = useState({
    Amount: "",
    Description: "",
    date: "",
    category: ""
  });
  const predefinedCategories = ['Food', 'Bills', 'Entertainment', 'Income', 'Transportation', 'Other'];

  const fetchData = async () => {
    try {
      const res = await axios.post("http://localhost:8000/showData");
      if (res.data) {
        setDatas(res.data);
      }
    } catch (error) {
      console.log("Error fetching transaction history:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (index) => {
    const transactionToDelete = datas[index];
    axios.delete(`http://localhost:8000/deleteTransaction/${transactionToDelete._id}`)
      .then(response => {
        console.log("Transaction deleted:", response.data);
        setDatas(datas => datas.filter((_, i) => i !== index));
      })
      .catch(error => {
        console.error("Error in deleting transaction:", error);
      });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const transactionToEdit = datas[index];
    setEditFormData({
      Amount: transactionToEdit.Amount,
      Description: transactionToEdit.Description,
      date: new Date(transactionToEdit.date).toISOString().split('T')[0],
      category: transactionToEdit.category
    });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = (index) => {
    const updatedTransactions = [...datas];
    updatedTransactions[index] = { ...updatedTransactions[index], ...editFormData };
    const transactionToUpdate = updatedTransactions[index];

    axios.put(`http://localhost:8000/updateTransaction/${transactionToUpdate._id}`, editFormData)
      .then(response => {
        console.log("Transaction updated successfully:", response.data);
        setDatas(updatedTransactions);
        setEditingIndex(-1);
      })
      .catch(error => {
        console.error("Error updating transaction:", error);
      });
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
  };

  return (
    <div className="list-div" style={{ backgroundColor: "#F5ECE0" }}>
      <h1 className="list-title text-3xl md:text-4xl lg:text-5xl text-white mb-6 tracking-wide" style={{ fontWeight: "bold", color: "#483d8b" }}>
        Transaction History
      </h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((item, index) => (
              <tr key={index}>
                {editingIndex === index ? (
                  <>
                    <td>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditInputChange}
                        className="w-full border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {predefinedCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </td>
                    <td><input type="number" name="Amount" value={editFormData.Amount} onChange={handleEditInputChange} className="w-full border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500" /></td>
                    <td><textarea name="Description" value={editFormData.Description} onChange={handleEditInputChange} className="w-full border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500" /></td>
                    <td><input type="date" name="date" value={editFormData.date} onChange={handleEditInputChange} className="w-full border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500" /></td>
                    <td onClick={() => handleCancelEdit()} className="cursor-pointer text-red-500">❌</td>
                    <td onClick={() => handleSaveEdit(index)} className="cursor-pointer text-green-500">💾</td>
                  </>
                ) : (
                  <>
                    <td>{item.category}</td>
                    <td>₹{item.Amount}</td>
                    <td>{item.Description}</td>
                    <td>{new Date(item.date).toLocaleDateString('en-GB')}</td>
                    <td onClick={() => handleDelete(index)} className="cursor-pointer text-red-500">🗑️</td>
                    <td onClick={() => handleEdit(index)} className="cursor-pointer text-blue-500">✏️</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}