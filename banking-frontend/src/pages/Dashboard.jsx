import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Banking Dashboard</h1>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/accounts")}
                        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                    >
                        Manage Accounts
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-8">
                <h2 className="text-3xl font-semibold mb-4">
                    Welcome to Your Banking System
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-xl font-bold">Accounts</h3>
                        <p>View and manage your accounts</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-xl font-bold">Transactions</h3>
                        <p>Deposit, Withdraw, Transfer funds</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-xl font-bold">Statements</h3>
                        <p>Download account history</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;