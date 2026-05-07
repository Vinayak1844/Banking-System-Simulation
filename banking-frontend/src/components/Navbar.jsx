import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinkClass = ({ isActive }) =>
        `rounded-md px-3 py-2 text-sm font-medium transition ${
            isActive
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`;

    return (
        <nav className="border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-lg font-semibold text-slate-900"
                >
                    TrustBank
                </button>

                <div className="flex items-center gap-2">
                    <NavLink to="/dashboard" className={navLinkClass}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/accounts" className={navLinkClass}>
                        Accounts
                    </NavLink>
                    <NavLink to="/transactions" className={navLinkClass}>
                        Transactions
                    </NavLink>
                </div>

                <button
                    className="rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;