import { useState } from "react";
import api from "../services/api";

const TransferForm = ({ fetchAccounts }) => {
    const [fromAccountId, setFromAccountId] = useState("");
    const [toAccountId, setToAccountId] = useState("");
    const [amount, setAmount] = useState("");

    const handleTransfer = async (e) => {
        e.preventDefault();

        try {
            await api.post("/transactions/transfer", {
                fromAccountId,
                toAccountId,
                amount,
            });

            alert("Transfer successful");

            setFromAccountId("");
            setToAccountId("");
            setAmount("");

            fetchAccounts();
        } catch (error) {
            console.error(error);
            alert("Transfer failed");
        }
    };

    return (
        <div className="card p-3 shadow-sm mb-3">
            <h4>Transfer Money</h4>

            <form onSubmit={handleTransfer}>
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="From Account ID"
                        value={fromAccountId}
                        onChange={(e) => setFromAccountId(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="To Account ID"
                        value={toAccountId}
                        onChange={(e) => setToAccountId(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <button className="btn btn-primary w-100">
                    Transfer
                </button>
            </form>
        </div>
    );
};

export default TransferForm;