import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import apiClient from "../api/client.js";

const Stat = ({ label, value, hint }) => (
  <div className="bg-white rounded-xl shadow p-5">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
  </div>
);

export const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiClient
      .get("/api/items")
      .then(({ data }) => {
        if (active) setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active)
          setError(err?.response?.data?.message || "Could not load your items");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const totalUnits = items.reduce((sum, i) => sum + Number(i.stock || 0), 0);
  const stockValue = items.reduce(
    (sum, i) => sum + Number(i.purchasePrice || 0) * Number(i.stock || 0),
    0
  );
  const lowStock = items.filter((i) => Number(i.stock) <= 5).length;

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-gray-700 mb-1">
        Welcome back{user?.name ? `, ${user.name}` : ""} 🎉
      </h2>
      <p className="text-slate-500 mb-6">Here&apos;s a snapshot of your inventory.</p>

      {loading ? (
        <Loader label="Loading your dashboard..." />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3">
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Stat label="Items" value={items.length} />
            <Stat label="Units in stock" value={totalUnits} />
            <Stat
              label="Stock value"
              value={stockValue.toFixed(2)}
              hint="at purchase price"
            />
            <Stat label="Low stock" value={lowStock} hint="5 units or fewer" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-slate-600">
            {items.length === 0 ? (
              <>
                You haven&apos;t added any items yet.{" "}
                <Link to="/items" className="text-brand-600 font-medium hover:underline">
                  Add your first item
                </Link>
                .
              </>
            ) : (
              <>
                Manage your inventory on the{" "}
                <Link to="/items" className="text-brand-600 font-medium hover:underline">
                  Items
                </Link>{" "}
                page.
              </>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
