import { useState, useEffect, useCallback, useRef } from "react";
import { usePageMeta } from "../hooks/usePageMeta";
import { API_URL } from "../lib/api";

async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 900;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.82);
    };
    img.src = url;
  });
}

const EMPTY_FORM = {
  driver: "",
  year: new Date().getFullYear(),
  set_name: "",
  condition: "Mint",
  price: "",
  image_url: "",
  sport: "f1",
  product_type: "single",
  stock: 1,
  featured: false,
};

export function AdminPage() {
  usePageMeta({ title: "Admin — CNB Cards", description: "Admin panel" });

  const [adminKey, setAdminKey] = useState(sessionStorage.getItem("cnb_admin_key") || "");
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const headers = {
    "Content-Type": "application/json",
    "x-admin-key": adminKey,
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/products`, { headers });
      if (!res.ok) throw new Error("Unauthorized");
      setProducts(await res.json());
      setError(null);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const handleLogin = async (e) => {
    e.preventDefault();
    sessionStorage.setItem("cnb_admin_key", adminKey);
    const res = await fetch(`${API_URL}/api/admin/products`, {
      headers: { "x-admin-key": adminKey },
    });
    if (res.ok) {
      setAuthenticated(true);
      setProducts(await res.json());
    } else {
      setError("Invalid admin key");
    }
  };

  useEffect(() => {
    if (authenticated) fetchProducts();
  }, [authenticated, fetchProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_URL}/api/admin/products/${editingId}`
      : `${API_URL}/api/admin/products`;

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ ...EMPTY_FORM });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } else {
      const data = await res.json();
      setError(data.message || "Failed to save");
    }
  };

  const handleEdit = (product) => {
    setForm({
      driver: product.driver,
      year: product.year,
      set_name: product.set_name,
      condition: product.condition,
      price: product.price,
      image_url: product.image_url || "",
      sport: product.sport,
      product_type: product.product_type,
      stock: product.stock,
      featured: product.featured,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id, driver) => {
    if (!window.confirm(`Delete "${driver}"? This cannot be undone.`)) return;

    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });

    if (res.ok || res.status === 204) {
      fetchProducts();
    } else {
      setError("Failed to delete");
    }
  };

  const handleCancel = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed, "image.jpg");
      const res = await fetch(`${API_URL}/api/admin/upload-image`, {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Upload failed"); return; }
      setForm((prev) => ({ ...prev, image_url: data.url }));
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h1 className="text-2xl font-bold text-[#111111] mb-6">Admin Login</h1>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Admin key"
            autoComplete="off"
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111111] mb-4 focus:outline-none focus:ring-2 focus:ring-f1-red/50"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-f1-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#111111]">Product Management</h1>
          <div className="flex gap-3">
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...EMPTY_FORM }); }}
              className="px-4 py-2 bg-f1-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              + Add Product
            </button>
            <button
              onClick={async () => {
                const res = await fetch(`${API_URL}/api/admin/orders/export`, {
                  headers: { "x-admin-key": adminKey },
                });
                if (!res.ok) return;
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `cnb-orders-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Export Orders (CSV)
            </button>
            <button
              onClick={() => { setAuthenticated(false); sessionStorage.removeItem("cnb_admin_key"); }}
              className="px-4 py-2 bg-gray-200 text-[#4B5563] text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-[#111111] mb-6">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">Type</label>
                    <select
                      value={form.product_type}
                      onChange={(e) => setForm({ ...form, product_type: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                    >
                      <option value="single">Single</option>
                      <option value="sealed_box">Sealed Box</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">Sport</label>
                    <select
                      value={form.sport}
                      onChange={(e) => setForm({ ...form, sport: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                    >
                      <option value="f1">Formula 1</option>
                      <option value="football">Football</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">
                    {form.product_type === "sealed_box" ? "Product Name" : "Driver"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.driver}
                    onChange={(e) => setForm({ ...form, driver: e.target.value })}
                    placeholder={form.product_type === "sealed_box" ? "e.g. Topps Chrome F1 2024 Hobby Box" : "e.g. Max Verstappen"}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">Year</label>
                    <input
                      type="number"
                      required
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">Collection</label>
                    <input
                      type="text"
                      required
                      value={form.set_name}
                      onChange={(e) => setForm({ ...form, set_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">Condition</label>
                    <select
                      value={form.condition}
                      onChange={(e) => setForm({ ...form, condition: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                    >
                      <option value="Mint">Mint</option>
                      <option value="Near Mint">Near Mint</option>
                      <option value="Excellent">Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">Price (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1">Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    {form.image_url && (
                      <img src={form.image_url} alt="preview" className="w-12 h-14 object-cover rounded border border-[#E5E7EB] flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-gray-100 border border-[#E5E7EB] text-sm text-[#4B5563] rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {uploading ? "Uploading..." : form.image_url ? "Change image" : "Choose image"}
                      </button>
                      {form.image_url && !uploading && <p className="text-xs text-green-600 mt-1">Image uploaded</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1">Stock</label>
                    <input
                      type="number"
                      required
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-f1-red/50"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 text-sm text-[#4B5563] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-f1-red focus:ring-f1-red"
                      />
                      Featured on homepage
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 bg-f1-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading image..." : editingId ? "Save Changes" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2.5 bg-gray-200 text-[#4B5563] text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product table */}
        {loading ? (
          <div className="text-center py-20 text-[#9CA3AF]">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-4 py-3 font-semibold text-[#4B5563]">Product</th>
                  <th className="px-4 py-3 font-semibold text-[#4B5563]">Collection</th>
                  <th className="px-4 py-3 font-semibold text-[#4B5563]">Year</th>
                  <th className="px-4 py-3 font-semibold text-[#4B5563]">Condition</th>
                  <th className="px-4 py-3 font-semibold text-[#4B5563]">Price</th>
                  <th className="px-4 py-3 font-semibold text-[#4B5563]">Stock</th>
                  <th className="px-4 py-3 font-semibold text-[#4B5563]">Type</th>
                  <th className="px-4 py-3 font-semibold text-[#4B5563]">Featured</th>
                  <th className="px-4 py-3 font-semibold text-[#4B5563]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...products]
                  .sort((a, b) => {
                    if (a.stock === 0 && b.stock > 0) return 1;
                    if (a.stock > 0 && b.stock === 0) return -1;
                    return 0;
                  })
                  .map((p) => {
                    const sold = p.stock === 0;
                    return (
                      <tr
                        key={p.id}
                        className={`border-b border-[#E5E7EB] ${sold ? "bg-red-50" : "hover:bg-gray-50"}`}
                      >
                        <td className="px-4 py-3 font-medium text-[#111111]">
                          {p.driver}
                          {sold && <span className="ml-2 text-xs font-semibold text-red-500">SOLD</span>}
                        </td>
                        <td className="px-4 py-3 text-[#4B5563]">{p.set_name}</td>
                        <td className="px-4 py-3 text-[#4B5563]">{p.year}</td>
                        <td className="px-4 py-3 text-[#4B5563]">{p.condition}</td>
                        <td className="px-4 py-3 text-[#4B5563]">€{Number(p.price).toFixed(2)}</td>
                        <td className={`px-4 py-3 font-medium ${sold ? "text-red-400" : "text-[#4B5563]"}`}>{p.stock}</td>
                        <td className="px-4 py-3 text-[#4B5563]">{p.product_type === "sealed_box" ? "Sealed Box" : "Single"}</td>
                        <td className="px-4 py-3 text-[#4B5563]">{p.featured ? "Yes" : "No"}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.driver)}
                              className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-[#9CA3AF]">
                      No products yet. Click "Add Product" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
