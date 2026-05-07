import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-lg">
                    <p className="text-sm uppercase tracking-wider text-blue-100">Welcome</p>
                    <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                        Your Banking Dashboard
                    </h2>
                    <p className="mt-3 max-w-2xl text-blue-100">
                        Track balances, manage accounts, and complete transactions with a clean and
                        secure banking workspace.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate("/accounts")}
                            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                        >
                            Manage Accounts
                        </button>
                        <button
                            onClick={() => navigate("/transactions")}
                            className="rounded-lg bg-blue-500/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500/60"
                        >
                            Open Transactions
                        </button>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900">Accounts</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Create and manage savings/current accounts in one place.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900">Transactions</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Deposit, withdraw, and transfer funds with instant updates.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900">History</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Review recent transaction activity account-wise.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;