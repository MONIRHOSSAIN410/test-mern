import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <h1 className="text-2xl font-bold text-indigo-600">DashFlow</h1>
      <Link
        to="/login"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Login
      </Link>
    </header>
  );
};

export default Navbar;
