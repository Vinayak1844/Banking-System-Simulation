import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [accountType, setAccountType] = useState("");
    const [message, setMessage] = useState("");

    async function fetchAccounts() {
        try {
            const res = await api.get("/accounts/my");
            setAccounts(res.data);
        } catch {
            setMessage("Failed to load accounts");
        }
    }

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

    const deleteBankAccount = async (accountId) => {
        const isConfirmed = window.confirm(
            "Delete this bank account? This action cannot be undone."
        );

        if (!isConfirmed) {
            return;
        }

        try {
            await api.delete(`/accounts/${accountId}`);
            setMessage("Bank account deleted successfully");
            fetchAccounts();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to delete bank account");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAccounts();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <h1 className="mb-2 text-3xl font-bold text-slate-900">My Accounts</h1>
                <p className="mb-6 text-sm text-slate-600">
                    Create and monitor all your banking accounts here.
                </p>

                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">Create New Account</h2>

                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="mb-4 w-full rounded-lg border border-slate-300 p-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">Select Account Type</option>
                        <option value="SAVINGS">Savings</option>
                        <option value="CURRENT">Current</option>
                    </select>

                    <button
                        onClick={createAccount}
                        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        Create Account
                    </button>

                    {message && (
                        <p className="mt-3 rounded-md bg-slate-100 px-3 py-2 text-center text-sm text-slate-700">
                            {message}
                        </p>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {accounts.map((acc) => (
                        <div
                            key={acc.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <h3 className="mb-2 text-xl font-semibold text-slate-900">
                                {acc.accountType}
                            </h3>

                            <p className="text-sm text-slate-500">
                                Account Number
                                <span className="ml-2 font-medium text-slate-700">{acc.accountNumber}</span>
                            </p>

                            <p className="mt-4 text-sm text-slate-500">Current Balance</p>
                            <p className="text-3xl font-bold text-emerald-600">
                                ₹{Number(acc.balance).toLocaleString()}
                            </p>

                            <button
                                onClick={() => deleteBankAccount(acc.id)}
                                className="mt-5 w-full rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                            >
                                Delete Bank Account
                            </button>
                        </div>
                    ))}
                </div>

                {accounts.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
                        No accounts available yet. Create your first account to get started.
                    </p>
                )}
            </div>
        </div>
    );
}