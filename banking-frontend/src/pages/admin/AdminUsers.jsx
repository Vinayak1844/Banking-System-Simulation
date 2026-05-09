import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    async function fetchUsers() {
        try {
            const res = await API.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to load users"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="p-8">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        All Users
                    </h1>

                    <button
                        onClick={fetchUsers}
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
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Role</th>
                        </tr>
                        </thead>

                        <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center p-8 text-gray-500"
                                >
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-4">
                                        {index + 1}
                                    </td>

                                    <td className="p-4">
                                        {user.name}
                                    </td>

                                    <td className="p-4">
                                        {user.email}
                                    </td>

                                    <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    user.role === "ADMIN"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
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

export default AdminUsers;