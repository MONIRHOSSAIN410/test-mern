import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const linkClass = "block py-2.5 px-4 rounded hover:bg-indigo-100";
  const activeClass = "bg-indigo-100 text-indigo-600 font-semibold";

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm fixed left-0 top-0">
      <div className="p-6 text-2xl font-bold text-indigo-600">DashFlow</div>
      <nav className="px-4 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? `${linkClass} ${activeClass}` : linkClass
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/items"
          className={({ isActive }) =>
            isActive ? `${linkClass} ${activeClass}` : linkClass
          }
        >
          Items
        </NavLink>
        <NavLink
          to="/sales"
          className={({ isActive }) =>
            isActive ? `${linkClass} ${activeClass}` : linkClass
          }
        >
          Sales
        </NavLink>

        {/* Logout as a button instead of NavLink */}
        <button
          onClick={handleLogout}
          className={`${linkClass} text-red-500 w-full text-left`}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};
