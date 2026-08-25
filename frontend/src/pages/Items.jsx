import DashboardLayout from "../layouts/DashboardLayout";

export const Items = () => {
  return (
    <DashboardLayout>
      <div className="text-2xl font-bold text-gray-700 mb-4">Items</div>

      {/* Placeholder for table or cards */}
      <div className="bg-white p-6 rounded shadow text-gray-600">
        This is where you'll manage your inventory items. <br />
        Add, update, delete, and search items here.
      </div>
    </DashboardLayout>
  );
};

