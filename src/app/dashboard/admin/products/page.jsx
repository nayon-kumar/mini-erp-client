"use client";

import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, Button } from "@heroui/react";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
      setError("");
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  // Handle delete product
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeletingId(productToDelete._id);
      const response = await fetch(
        `http://localhost:5000/products/${productToDelete._id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Remove product from state
      setProducts(
        products.filter((product) => product._id !== productToDelete._id),
      );
      setError("");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      console.error("Error deleting product:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle view product
  const handleView = (id) => {
    router.push(`/dashboard/admin/products/${id}`);
  };

  // Handle edit product
  const handleEdit = (id) => {
    router.push(`/dashboard/admin/products/edit/${id}`);
  };

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.productName?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower) ||
      product.sku?.toLowerCase().includes(searchLower)
    );
  });

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your products and inventory.</p>
        </div>

        <Link
          href="/dashboard/admin/products/add"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
          <button
            onClick={fetchProducts}
            className="ml-4 text-red-700 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600">
              {searchTerm
                ? "No products found matching your search."
                : "No products available."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left font-semibold">Category</th>
                <th className="px-6 py-4 text-left font-semibold">Price</th>
                <th className="px-6 py-4 text-left font-semibold">Stock</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                      {product.category || "Uncategorized"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">
                        {formatPrice(product.sellingPrice)}
                      </p>
                      {product.purchasePrice && (
                        <p className="text-xs text-gray-500">
                          Cost: {formatPrice(product.purchasePrice)}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        product.stock > 20
                          ? "bg-green-100 text-green-700"
                          : product.stock > 5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(product._id)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="View product"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => handleEdit(product._id)}
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-100 transition-colors"
                        title="Edit product"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => openDeleteDialog(product)}
                        disabled={deletingId === product._id}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete product"
                      >
                        {deletingId === product._id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>
                  Delete product permanently?
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>
                  This will permanently delete{" "}
                  <strong>{productToDelete?.productName}</strong> and all of its
                  data. This action cannot be undone.
                </p>
                {productToDelete?.sku && (
                  <p className="mt-2 text-sm text-gray-500">
                    SKU: {productToDelete.sku}
                  </p>
                )}
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  slot="close"
                  variant="tertiary"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setProductToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  slot="close"
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={deletingId === productToDelete?._id}
                >
                  Delete Product
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
}
