import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");

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

    const fetchTransactions = useCallback(async () => {
        try {
            const res = await API.get("/admin/transactions");
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
            alert(getErrorMessage(err, "Failed to load transactions"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchTransactions]);

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter((txn) =>
                filter === "ALL"
                    ? true
                    : txn.transactionType === filter
            )
            .filter((txn) => {
                if (!search.trim()) return true;

                const term = search.toLowerCase();

                return (
                    String(txn.id).includes(term) ||
                    String(txn.amount).includes(term) ||
                    txn.transactionType
                        ?.toLowerCase()
                        .includes(term) ||
                    String(txn.fromAccount?.id || "")
                        .includes(term) ||
                    String(txn.toAccount?.id || "")
                        .includes(term)
                );
            });
    }, [transactions, filter, search]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="p-8">
                    Loading transactions...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        All Transactions
                    </h1>

                    <button
                        onClick={fetchTransactions}
                        className="bg-gray-200 px-4 py-2 rounded"
                    >
                        Refresh
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-2xl shadow mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Search by ID, amount, account..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="border p-3 rounded w-full"
                        />

                        <select
                            value={filter}
                            onChange={(e) =>
                                setFilter(e.target.value)
                            }
                            className="border p-3 rounded w-full"
                        >
                            <option value="ALL">
                                All Types
                            </option>
                            <option value="DEPOSIT">
                                Deposit
                            </option>
                            <option value="WITHDRAW">
                                Withdraw
                            </option>
                            <option value="TRANSFER">
                                Transfer
                            </option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="p-4 text-left">
                                ID
                            </th>
                            <th className="p-4 text-left">
                                Type
                            </th>
                            <th className="p-4 text-left">
                                Amount
                            </th>
                            <th className="p-4 text-left">
                                From
                            </th>
                            <th className="p-4 text-left">
                                To
                            </th>
                            <th className="p-4 text-left">
                                Timestamp
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center p-8 text-gray-500"
                                >
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((txn) => (
                                <tr
                                    key={txn.id}
                                    className={`border-b hover:bg-gray-50 ${
                                        txn.transactionType === "DEPOSIT"
                                            ? "bg-green-50"
                                            : txn.transactionType === "WITHDRAW"
                                                ? "bg-red-50"
                                                : "bg-blue-50"
                                    }`}
                                >
                                    <td className="p-4">
                                        {txn.id}
                                    </td>

                                    <td className="p-4 font-semibold">
                                        {txn.transactionType}
                                    </td>

                                    <td className="p-4">
                                        ₹{txn.amount}
                                    </td>

                                    <td className="p-4">
                                        {txn.fromAccount?.user?.name || "-"}
                                    </td>

                                    <td className="p-4">
                                        {txn.toAccount?.user?.name || "-"}
                                    </td>

                                    <td className="p-4">
                                        {new Date(
                                            txn.timeStamp
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminTransactions;