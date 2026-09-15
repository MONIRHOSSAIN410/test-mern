import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const navLink = ({ isActive }) =>
  `text-sm font-medium transition ${
    isActive ? "text-brand-600" : "text-gray-600 hover:text-brand-600"
  }`;

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="flex flex-wrap gap-4 justify-between items-center px-6 py-4 shadow bg-white">
      <Link to="/" className="text-2xl font-bold text-brand-600">
        DashFlow
      </Link>

      {/* The Search and Contact pages had routes but no link anywhere in the
          UI, so they were unreachable unless you typed the URL by hand. */}
      <nav className="flex items-center gap-5">
        <NavLink to="/search" className={navLink}>
          Search
        </NavLink>
        <NavLink to="/contact" className={navLink}>
          Contact
        </NavLink>

        {user ? (
          <Link
            to="/dashboard"
            className="bg-brand-600 text-white px-4 py-2 rounded hover:bg-brand-700 transition"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-brand-600 text-white px-4 py-2 rounded hover:bg-brand-700 transition"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
