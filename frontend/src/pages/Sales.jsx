import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

export const Sales = () => {
  return (
    <DashboardLayout>
      {/* Honest placeholder: there is no Sale model or /api/sales route in the
          backend yet, so this page intentionally does not pretend to work. */}
      <div className="bg-white p-6 rounded shadow text-gray-600">
        <p className="font-medium text-slate-700 mb-2">Coming soon</p>
        <p>
          Sales tracking needs a <code>Sale</code> model and{" "}
          <code>/api/sales</code> routes on the backend, which don&apos;t exist
          yet. Item management is fully working on the{" "}
          <Link to="/items" className="text-brand-600 hover:underline">
            Items
          </Link>{" "}
          page.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Sales;
