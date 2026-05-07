import { useState } from "react";
import api from "../services/api";

const DepositForm = ({ fetchAccounts }) => {
    const [accountId, setAccountId] = useState("");
    const [amount, setAmount] = useState("");

    const handleDeposit = async (e) => {
        e.preventDefault();

        try {
            await api.post(`/transactions/deposit`, {
                accountId,
                amount,
            });

            alert("Amount deposited successfully");

            setAccountId("");
            setAmount("");

            fetchAccounts();
        } catch (error) {
            console.error(error);
            alert("Deposit failed");
        }
    };

    return (
        <div className="card p-3 shadow-sm mb-3">
            <h4>Deposit Money</h4>

            <form onSubmit={handleDeposit}>
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter Account ID"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
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

                <button className="btn btn-success w-100">
                    Deposit
                </button>
            </form>
        </div>
    );
};

export default DepositForm;