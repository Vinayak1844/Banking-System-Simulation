import { useState, useContext } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const { login } = useContext(AuthContext);
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
            const response = await API.post("/auth/login", form);
            console.log(response.data);

            login(response.data);

            alert("Login successful");
            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data || "Invalid credentials");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.2),_transparent_35%)]" />
            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
            >
                <h2 className="mb-2 text-center text-3xl font-bold text-slate-900">Welcome Back</h2>
                <p className="mb-6 text-center text-sm text-slate-500">
                    Sign in to manage your banking activity securely.
                </p>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="mb-4 w-full rounded-lg border border-slate-300 p-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="mb-5 w-full rounded-lg border border-slate-300 p-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onChange={handleChange}
                    required
                />

                <button className="w-full rounded-lg bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700">
                    Login
                </button>

                <p className="mt-5 text-center text-sm text-slate-600">
                    Do not have an account?{" "}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;