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
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.2),_transparent_40%)]" />
            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
            >
                <h2 className="mb-2 text-center text-3xl font-bold text-slate-900">Create Account</h2>
                <p className="mb-6 text-center text-sm text-slate-500">
                    Open your digital banking profile in a minute.
                </p>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="mb-4 w-full rounded-lg border border-slate-300 p-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onChange={handleChange}
                    required
                />

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

                <button className="w-full rounded-lg bg-emerald-600 p-3 font-medium text-white transition hover:bg-emerald-700">
                    Register
                </button>

                <p className="mt-5 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Register;