import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Simplify Your Inventory & Sales
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-xl text-gray-600">
          DashFlow helps you manage items, track sales, and stay on top of your business — all in one place.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/login"
            className="bg-brand-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-brand-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/search"
            className="border border-brand-600 text-brand-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-brand-50 transition"
          >
            Try Search
          </Link>
          <Link
            to="/contact"
            className="border border-slate-300 text-slate-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-white transition"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-8 text-brand-600">
            Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-2">🔐 Authentication</h4>
              <p className="text-gray-600">Secure login to protect your data</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">📦 Item Management</h4>
              <p className="text-gray-600">
                Add, update, delete, and search inventory items
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">💰 Sales Tracking</h4>
              <p className="text-gray-600">
                Create and manage sales records with ease
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-6 text-gray-500">
        © {new Date().getFullYear()} DashFlow by Farhaan Malik
      </footer>
    </div>
  );
};
