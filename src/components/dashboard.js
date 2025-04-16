import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./common.css";

const getMostRecentTransactions = (transactions, count = 5) => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedTransactions.slice(0, count);
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryBreakdown, setCategoryBreakdown] = useState({});

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:8000/getAllTransaction");
                setTransactions(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch transactions.");
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        if (transactions) {
            const total = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.Amount), 0);
            setTotalExpenses(total);

            const categoryTotals = transactions.reduce((acc, curr) => {
                const { category, Amount } = curr;
                if (!acc[category]) acc[category] = 0;
                acc[category] += Number(Amount);
                return acc;
            }, {});
            setCategoryBreakdown(categoryTotals);
        }
    }, [transactions]);

    const recentTransactions = getMostRecentTransactions(transactions);

    if (loading) return <div>Loading dashboard data...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="dashboard-container" style={styles.dashboardContainer}>
            <h2 style={styles.dashboardTitle}>Dashboard</h2>

            <div className="summary-cards" style={styles.summaryCards}>
                <div className="card" style={{ ...styles.card, ...styles.totalExpensesCard }}>
                    <h3>Total Expenses</h3>
                    <p style={styles.totalExpensesAmount}>{formatCurrency(totalExpenses)}</p>
                </div>

                <div className="card" style={{ ...styles.card, ...styles.categoryBreakdownCard }}>
                    <h3>Category Breakdown</h3>
                    <ul>
                        {Object.entries(categoryBreakdown).map(([category, total]) => (
                            <li key={category} style={styles.categoryBreakdownItem}>
                                {category}: {formatCurrency(total)}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card" style={{ ...styles.card, ...styles.recentTransactionsCard }}>
                    <h3>Recent Transactions</h3>
                    <ul>
                        {recentTransactions.map((txn, index) => (
                            <li key={index} style={styles.recentTransactionItem}>
                                <span style={styles.recentTransactionDate}>{formatDate(txn.date)}</span> -
                                <span style={styles.recentTransactionCategory}> {txn.category}</span>:
                                <span style={styles.recentTransactionAmount}> {formatCurrency(txn.Amount)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const styles = {
    dashboardContainer: {
        padding: '20px',
        backgroundColor: '#f0f8ff',
        height: "90vh",
        margin: "25px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e0e0e0",
    },
    dashboardTitle: {
        fontSize:"40px",
        display: "flex",
        marginLeft: "40vw",
        color: '#483d8b',
        marginBottom: '20px',
    },
    summaryCards: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        flex: '1 1 300px',
        minWidth: '300px',
        transition: 'transform 0.2s',
        backgroundColor: '#fff',
    },
    totalExpensesCard: {
        background: 'linear-gradient(to right, #e0ffff, #afeeee)',
    },
    totalExpensesAmount: {
        fontSize: '1.8em',
        color: '#2e8b57',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    categoryBreakdownCard: {
        background: 'linear-gradient(to right, #fff8dc, #f5f5dc)',
    },
    categoryBreakdownItem: {
        fontSize: '1em',
        marginBottom: '6px',
        fontWeight: '500',
        color: '#5d4037',
    },
    recentTransactionsCard: {
        background: 'linear-gradient(to right, #ffe4e1, #ffcccb)',
    },
    recentTransactionItem: {
        fontSize: '1em',
        marginBottom: '6px',
        fontWeight: '500',
    },
    recentTransactionDate: {
        fontWeight: 'bold',
        marginRight: '5px',
    },
    recentTransactionCategory: {
        fontStyle: 'italic',
        marginRight: '5px',
    },
    recentTransactionAmount: {
        fontWeight: 'bold',
        color: '#d32f2f',
    },
};

export default Dashboard;
