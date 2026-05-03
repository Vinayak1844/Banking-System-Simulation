import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/users/register", form);
            alert("Registration successful");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-96"
            >
                <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="w-full mb-4 p-3 border rounded"
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full mb-4 p-3 border rounded"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full mb-4 p-3 border rounded"
                    onChange={handleChange}
                    required
                />

                <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                    Register
                </button>

                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Register;