import { useSelector } from "react-redux";
import { Sidebar } from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 w-full min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="p-6 shadow bg-white border-b flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>

          {user && (
            <span className="text-sm text-gray-600 font-medium">
              Welcome, <span className="text-indigo-600">{user.name}</span> 👋
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
