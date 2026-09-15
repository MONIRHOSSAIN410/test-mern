import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Items } from "./pages/Items";
import { Sales } from "./pages/Sales";
import { Register } from "./pages/Register";
import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searchtxt from "./pages/Searchtxt";
import ContactUs from "./pages/ContactUs";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
    <p className="text-6xl font-bold text-brand-600 mb-2">404</p>
    <h1 className="text-xl font-semibold text-slate-700 mb-4">
      This page doesn&apos;t exist
    </h1>
    <Link
      to="/"
      className="bg-brand-600 text-white px-5 py-2.5 rounded-md hover:bg-brand-700 transition"
    >
      Back to home
    </Link>
  </div>
);

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Lowercase paths are the canonical ones; the original
              mixed-case paths are kept so old links keep working. */}
          <Route path="/search" element={<Searchtxt />} />
          <Route path="/Searchtxt" element={<Searchtxt />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/ContactUs" element={<ContactUs />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/items"
            element={
              <PrivateRoute>
                <Items />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <Sales />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
