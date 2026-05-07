import { useState } from "react";
import api from "../services/api";

const WithdrawForm = ({ fetchAccounts }) => {
    const [accountId, setAccountId] = useState("");
    const [amount, setAmount] = useState("");

    const handleWithdraw = async (e) => {
        e.preventDefault();

        try {
            await api.post("/transactions/withdraw", {
                accountId,
                amount,
            });

            alert("Withdrawal successful");

            setAccountId("");
            setAmount("");

            fetchAccounts();
        } catch (error) {
            console.error(error);
            alert("Withdrawal failed");
        }
    };

    return (
        <div className="card p-3 shadow-sm mb-3">
            <h4>Withdraw Money</h4>

            <form onSubmit={handleWithdraw}>
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

                <button className="btn btn-warning w-100">
                    Withdraw
                </button>
            </form>
        </div>
    );
};

export default WithdrawForm;