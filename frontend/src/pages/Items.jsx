import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import apiClient from "../api/client.js";

const EMPTY_FORM = {
  name: "",
  purchasePrice: "",
  sellingPrice: "",
  stock: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export const Items = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/api/items");
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not load items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Item name is required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
      stock: Number(form.stock),
    };

    if (
      [payload.purchasePrice, payload.sellingPrice, payload.stock].some(
        (n) => Number.isNaN(n) || n < 0
      )
    ) {
      toast.error("Prices and stock must be non-negative numbers");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { data } = await apiClient.put(`/api/items/${editingId}`, payload);
        setItems((prev) => prev.map((i) => (i._id === editingId ? data : i)));
        toast.success("Item updated");
      } else {
        const { data } = await apiClient.post("/api/items", payload);
        setItems((prev) => [data, ...prev]);
        toast.success("Item added");
      }
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not save item");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      purchasePrice: String(item.purchasePrice),
      sellingPrice: String(item.sellingPrice),
      stock: String(item.stock),
    });
  };

  const onDelete = async (id) => {
    const previous = items;
    setItems((prev) => prev.filter((i) => i._id !== id));
    try {
      await apiClient.delete(`/api/items/${id}`);
      toast.success("Item deleted");
      if (editingId === id) resetForm();
    } catch (err) {
      setItems(previous); // roll back the optimistic removal
      toast.error(err?.response?.data?.message || "Could not delete item");
    }
  };

  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.name?.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <DashboardLayout>
      {/* Add / edit form */}
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <div className="lg:col-span-2">
          <label className="block text-sm text-slate-600 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="e.g. Blue T-Shirt"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Purchase price
          </label>
          <input
            name="purchasePrice"
            type="number"
            min="0"
            step="0.01"
            value={form.purchasePrice}
            onChange={onChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Selling price
          </label>
          <input
            name="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.sellingPrice}
            onChange={onChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={onChange}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-600 text-white px-5 py-2 rounded hover:bg-brand-700 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update item" : "Add item"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search items by name..."
        className={`${inputClass} mb-4 max-w-sm bg-white`}
      />

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <Loader label="Loading items..." />
        ) : visibleItems.length === 0 ? (
          <p className="p-6 text-slate-500">
            {items.length === 0
              ? "No items yet — add your first one above."
              : "No items match that search."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Purchase</th>
                <th className="px-4 py-3">Selling</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Profit / unit</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {item.name}
                  </td>
                  <td className="px-4 py-3">{item.purchasePrice}</td>
                  <td className="px-4 py-3">{item.sellingPrice}</td>
                  <td className="px-4 py-3">{item.stock}</td>
                  <td className="px-4 py-3">
                    {Number(item.sellingPrice) - Number(item.purchasePrice)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-brand-600 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Items;
