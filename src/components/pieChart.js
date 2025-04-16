import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from 'axios';

const COLORS = ["#9575CD", "#FDD835", "#F44336", "#BA68C8", "#4FC3F7", "#AED581", "#FFB74D", "#E57373"];

const PieChartt = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                console.error("Error fetching transactions:", err);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                Loading Pie Chart data...
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                Error loading Pie Chart data: {error}
            </div>
        );
    }

    const categoryTotals = transactions.reduce((acc, curr) => {
        const { category, Amount } = curr;
        if (!acc[category]) acc[category] = 0;
        acc[category] += Number(Amount);
        return acc;
    }, {});

    const data = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
    }));

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Category Breakdown</h2>
            <div style={styles.card}>
                <div style={styles.cardContent}>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => percent > 0.03 ? `${name} ${(percent * 100).toFixed(0)}%` : null}
                            labelLine={false}
                            paddingAngle={2}
                            isAnimationActive={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={styles.tooltipContent}
                            itemStyle={styles.tooltipItem}
                            formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}
                        />
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            iconSize={10}
                            wrapperStyle={styles.legendWrapper}
                        />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor:"#EABDE6",
        marginTop:"150px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '2rem auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        color: '#483d8b',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
    },
    cardContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        margin: '2rem',
        fontSize: '18px',
        color: '#333',
    },
    errorContainer: {
        color: '#d32f2f',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        margin: '2rem',
    },
    tooltipContent: {
        backgroundColor: '#424242',
        color: '#fff',
        borderRadius: '4px',
        padding: '8px',
    },
    tooltipItem: {
        color: '#fff',
    },
    legendWrapper: {
        marginLeft: '20px',
    },
};

export default PieChartt;
