import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Transactions() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [transferData, setTransferData] = useState({
        fromId: "",
        receiverName: "",
        amount: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    const getErrorMessage = (err, fallback) => {
        const errorData = err?.response?.data;
        if (typeof errorData === "string" && errorData.trim()) {
            return errorData;
        }
        if (errorData?.message) {
            return errorData.message;
        }
        return fallback;
    };

    const fetchTransactions = useCallback(async (accountId) => {
        try {
            const res = await API.get("/transactions/my/statement");
            const accountIdNum = Number(accountId);

            const filteredTransactions = (res.data || []).filter((txn) => {
                return (
                    Number(txn.fromAccountId) === accountIdNum ||
                    Number(txn.toAccountId) === accountIdNum
                );
            });

            setTransactions(filteredTransactions);
        } catch (err) {
            console.error(err);
            setMessage({
                type: "error",
                text: getErrorMessage(err, "Failed to load transactions"),
            });
        }
    }, []);

    const fetchAccounts = useCallback(async () => {
        try {
            const res = await API.get("/accounts/my");
            setAccounts(res.data);

            if (res.data.length > 0) {
                setSelectedAccount(res.data[0].id);
                fetchTransactions(res.data[0].id);
            }
        } catch (err) {
            console.error(err);
            setMessage({
                type: "error",
                text: "Failed to load accounts",
            });
        }
    }, [fetchTransactions]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAccounts();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchAccounts]);

    const refreshData = async () => {
        await fetchAccounts();
        if (selectedAccount) {
            fetchTransactions(selectedAccount);
        }
    };

    const handleDeposit = async () => {
        if (!depositAmount) {
            setMessage({
                type: "error",
                text: "Enter amount for deposit",
            });
            return;
        }
        try {
            setLoading(true);
            await API.post("/transactions/deposit", {
                accountId: selectedAccount,
                amount: depositAmount,
            });
            setMessage({
                type: "success",
                text: "Deposit successful",
            });
            setDepositAmount("");
            refreshData();
        } catch (err) {
            setMessage({
                type: "error",
                text: getErrorMessage(err, "Deposit failed"),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount) {
            setMessage({
                type: "error",
                text: "Enter amount for withdrawal",
            });
            return;
        }
        try {
            setLoading(true);
            await API.post("/transactions/withdraw", {
                accountId: selectedAccount,
                amount: withdrawAmount,
            });
            setMessage({
                type: "success",
                text: "Withdrawal successful",
            });
            setWithdrawAmount("");
            refreshData();
        } catch (err) {
            setMessage({
                type: "error",
                text: getErrorMessage(err, "Withdrawal failed"),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async () => {
        if (!transferData.fromId || !transferData.receiverName || !transferData.amount) {
            setMessage({
                type: "error",
                text: "Fill all transfer fields",
            });
            return;
        }
        try {
            setLoading(true);
            await API.post("/transactions/transfer", transferData);
            setMessage({
                type: "success",
                text: "Transfer successful",
            });
            setTransferData({
                fromId: "",
                receiverName: "",
                amount: "",
            });
            refreshData();
        } catch (err) {
            setMessage({
                type: "error",
                text: getErrorMessage(err, "Transfer failed"),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <h1 className="mb-2 text-3xl font-bold text-slate-900">Transactions</h1>
                <p className="mb-6 text-sm text-slate-600">
                    Deposit, withdraw, and transfer funds while tracking live transaction history.
                </p>

                {message.text && (
                    <p
                        className={`mb-6 rounded-lg px-4 py-3 text-sm font-medium ${
                            message.type === "success"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                        }`}
                    >
                        {message.text}
                    </p>
                )}

                <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                    {accounts.map((acc) => (
                        <div
                            key={acc.id}
                            className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition ${
                                selectedAccount == acc.id
                                    ? "border-blue-500 bg-blue-600 text-white"
                                    : "border-slate-200 bg-white hover:border-blue-300"
                            }`}
                            onClick={() => {
                                setSelectedAccount(acc.id);
                                fetchTransactions(acc.id);
                            }}
                        >
                            <h2 className="mb-2 text-lg font-semibold">{acc.accountType}</h2>
                            <p className="mb-4 text-sm opacity-90">{acc.accountNumber}</p>
                            <p className="text-2xl font-bold">₹{Number(acc.balance).toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-slate-900">Deposit</h2>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={depositAmount}
                            onChange={(e) =>
                                setDepositAmount(e.target.value)
                            }
                            className="mb-4 w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                        <button
                            onClick={handleDeposit}
                            disabled={loading}
                            className="w-full rounded-lg bg-emerald-600 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            Deposit
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-slate-900">Withdraw</h2>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={withdrawAmount}
                            onChange={(e) =>
                                setWithdrawAmount(e.target.value)
                            }
                            className="mb-4 w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                        />
                        <button
                            onClick={handleWithdraw}
                            disabled={loading}
                            className="w-full rounded-lg bg-rose-600 py-3 font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            Withdraw
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-slate-900">Transfer</h2>
                        <select
                            value={transferData.fromId}
                            onChange={(e) =>
                                setTransferData({
                                    ...transferData,
                                    fromId: e.target.value,
                                })
                            }
                            className="mb-4 w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Select Sender Account</option>
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.accountType} - {acc.accountNumber}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Receiver Username"
                            value={transferData.receiverName}
                            onChange={(e) =>
                                setTransferData({
                                    ...transferData,
                                    receiverName: e.target.value,
                                })
                            }
                            className="mb-4 w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={transferData.amount}
                            onChange={(e) =>
                                setTransferData({
                                    ...transferData,
                                    amount: e.target.value,
                                })
                            }
                            className="mb-4 w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <button
                            onClick={handleTransfer}
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            Transfer
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-900">Transaction History</h2>
                        <button
                            onClick={() => fetchTransactions(selectedAccount)}
                            className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                        >
                            Refresh
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-slate-700">
                                    <th className="p-4 text-left text-sm font-semibold">Type</th>
                                    <th className="p-4 text-left text-sm font-semibold">Amount</th>
                                    <th className="p-4 text-left text-sm font-semibold">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-slate-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((txn) => (
                                        <tr
                                            key={txn.id}
                                            className={`border-b border-slate-100 ${
                                                txn.type === "DEPOSIT"
                                                    ? "bg-emerald-50/50"
                                                    : txn.type === "WITHDRAW"
                                                      ? "bg-rose-50/60"
                                                      : "bg-blue-50/60"
                                            }`}
                                        >
                                            <td className="p-4 font-semibold text-slate-700">
                                                {txn.type}
                                            </td>
                                            <td className="p-4 text-slate-700">₹{txn.amount}</td>
                                            <td className="p-4 text-sm text-slate-600">
                                                {new Date(txn.time).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transactions;