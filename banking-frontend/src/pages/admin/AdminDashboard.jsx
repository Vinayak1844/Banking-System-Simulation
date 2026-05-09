import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    const cards = [
        {
            title: "Users",
            description: "View all registered users",
            path: "/admin/users",
        },
        {
            title: "Accounts",
            description: "View all bank accounts",
            path: "/admin/accounts",
        },
        {
            title: "Transactions",
            description: "View all transactions",
            path: "/admin/transactions",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="p-8 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">
                    Admin Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            onClick={() => navigate(card.path)}
                            className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:scale-105 transition"
                        >
                            <h2 className="text-2xl font-bold mb-2">
                                {card.title}
                            </h2>
                            <p>{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;