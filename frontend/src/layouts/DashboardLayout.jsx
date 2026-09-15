import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

const TITLES = {
  "/dashboard": "Dashboard",
  "/items": "Items",
  "/sales": "Sales",
};

const DashboardLayout = ({ children, title }) => {
  const { user } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  // The top bar used to say "Dashboard" on every page, including Items/Sales.
  const heading = title || TITLES[pathname] || "Dashboard";

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 w-full min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="p-6 shadow bg-white border-b flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-700">{heading}</h1>

          {user && (
            <span className="text-sm text-gray-600 font-medium">
              Welcome, <span className="text-brand-600">{user.name}</span> 👋
            </span>
          )}
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
