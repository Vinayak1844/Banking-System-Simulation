import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

function AdminAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    async function fetchAccounts() {
        try {
            const res = await API.get("/admin/accounts");
            setAccounts(res.data);
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to load accounts"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAccounts();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="p-8">Loading accounts...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        All Accounts
                    </h1>

                    <button
                        onClick={fetchAccounts}
                        className="bg-gray-200 px-4 py-2 rounded"
                    >
                        Refresh
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="p-4 text-left">ID</th>
                            <th className="p-4 text-left">Type</th>
                            <th className="p-4 text-left">
                                Account Number
                            </th>
                            <th className="p-4 text-left">Balance</th>
                            <th className="p-4 text-left">Owner</th>
                        </tr>
                        </thead>

                        <tbody>
                        {accounts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center p-8 text-gray-500"
                                >
                                    No accounts found
                                </td>
                            </tr>
                        ) : (
                            accounts.map((acc, index) => (
                                <tr
                                    key={acc.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-4">
                                        {index + 1}
                                    </td>

                                    <td className="p-4">
                                        {acc.accountType}
                                    </td>

                                    <td className="p-4">
                                        {acc.accountNumber}
                                    </td>

                                    <td className="p-4 font-semibold">
                                        ₹{acc.balance}
                                    </td>

                                    <td className="p-4">
                                        {acc.user?.name}
                                        {" "}
                                        (
                                        {acc.user?.email}
                                        )
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

export default AdminAccounts;