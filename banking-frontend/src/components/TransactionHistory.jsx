import { useEffect, useState } from "react";
import api from "../services/api";

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);

    async function fetchTransactions() {
        try {
            const response = await api.get("/transactions/history");
            setTransactions(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="card p-3 shadow-sm">
            <h4>Transaction History</h4>

            <table className="table table-bordered mt-3">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
                </thead>

                <tbody>
                {transactions.map((txn) => (
                    <tr key={txn.id}>
                        <td>{txn.id}</td>
                        <td>{txn.transactionType}</td>
                        <td>₹ {txn.amount}</td>
                        <td>{txn.createdAt}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionHistory;