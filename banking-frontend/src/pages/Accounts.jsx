import { useEffect, useState } from "react";
import api from "../services/api";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [accountType, setAccountType] = useState("");
    const [message, setMessage] = useState("");

    const fetchAccounts = async () => {
        try {
            const res = await api.get("/accounts/my");
            setAccounts(res.data);
        } catch (err) {
            setMessage("Failed to load accounts");
        }
    };

    const createAccount = async () => {
        try {
            await api.post("/accounts/create", {
                accountType,
            });

            setMessage("Account created successfully");
            setAccountType("");
            fetchAccounts();
        } catch (err) {
            setMessage(err.response?.data?.message || "Account creation failed");
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold mb-6 text-center">
                    My Accounts
                </h1>

                {/* Create Account */}
                <div className="bg-white p-6 rounded-xl shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">Create New Account</h2>

                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="w-full border p-3 rounded mb-4"
                    >
                        <option value="">Select Account Type</option>
                        <option value="SAVINGS">Savings</option>
                        <option value="CURRENT">Current</option>
                    </select>

                    <button
                        onClick={createAccount}
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                    >
                        Create Account
                    </button>

                    {message && (
                        <p className="mt-3 text-center text-red-500">{message}</p>
                    )}
                </div>

                {/* Accounts List */}
                <div className="grid md:grid-cols-2 gap-6">
                    {accounts.map((acc) => (
                        <div
                            key={acc.id}
                            className="bg-white rounded-xl shadow p-6"
                        >
                            <h3 className="text-xl font-bold mb-2">
                                {acc.accountType}
                            </h3>

                            <p className="text-gray-600">
                                Account No:
                                <span className="font-medium ml-2">
                  {acc.accountNumber}
                </span>
                            </p>

                            <p className="text-gray-600 mt-2">
                                Balance:
                                <span className="font-bold text-green-600 ml-2">
                  ₹{acc.balance}
                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}