"use client";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Tag,
  DollarSign,
  Box,
  Calendar,
  User,
  Building,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AlertDialog, Button } from "@heroui/react";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch product data
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/products/${productId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      setProduct(data);
      setError("");
    } catch (err) {
      setError("Failed to load product data. Please try again.");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete product
  const handleDelete = async () => {
    if (!product) return;

    try {
      setDeleting(true);
      const response = await fetch(
        `http://localhost:5000/products/${product._id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setDeleteDialogOpen(false);
      router.push("/dashboard/admin/products");
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      console.error("Error deleting product:", err);
    } finally {
      setDeleting(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock > 20) {
      return { label: "In Stock", color: "bg-green-100 text-green-700" };
    } else if (stock > 5) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    } else {
      return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (status === "active") {
      return { label: "Active", color: "bg-green-100 text-green-700" };
    } else {
      return { label: "Inactive", color: "bg-gray-100 text-gray-700" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-12">
        <div className="rounded-lg bg-red-50 p-6 text-red-700 border border-red-200">
          <h3 className="font-semibold text-lg mb-2">Error Loading Product</h3>
          <p>{error}</p>
          <button
            onClick={fetchProduct}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200 transition"
          >
            Try Again
          </button>
          <Link
            href="/dashboard/admin/products"
            className="mt-4 ml-4 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto py-12">
        <div className="rounded-lg bg-yellow-50 p-6 text-yellow-700 border border-yellow-200">
          <h3 className="font-semibold text-lg mb-2">Product Not Found</h3>
          <p>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/dashboard/admin/products"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-yellow-100 px-4 py-2 text-yellow-700 hover:bg-yellow-200 transition"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const statusBadge = getStatusBadge(product.status);

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/admin/products"
          className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.productName}
            </h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/dashboard/admin/products/edit/${product._id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-white hover:bg-amber-700 transition"
            >
              <Edit size={18} />
              Edit Product
            </Link>

            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700 transition"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Product Image */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {product.image ? (
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-auto rounded-xl object-cover border border-gray-200"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300">
                <Package className="h-16 w-16 text-gray-400" />
                <p className="mt-2 text-gray-500">No image available</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${statusBadge.color}`}
                >
                  {statusBadge.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Stock</span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${stockStatus.color}`}
                >
                  {stockStatus.label} ({product.stock})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {product.category || "Uncategorized"}
                </span>
              </div>

              {product.supplier && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Supplier</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {product.supplier}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pricing & Inventory */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Selling Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.sellingPrice)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Purchase Price</p>
                  <p className="text-lg font-medium text-gray-700">
                    {formatPrice(product.purchasePrice)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Profit Margin</p>
                  <p className="text-lg font-medium text-green-600">
                    {product.purchasePrice > 0 && product.sellingPrice > 0
                      ? formatPrice(
                          product.sellingPrice - product.purchasePrice,
                        )
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Stock Value</p>
                  <p className="text-lg font-medium text-gray-700">
                    {product.purchasePrice > 0 && product.stock > 0
                      ? formatPrice(product.purchasePrice * product.stock)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Product Details
            </h3>

            <div className="space-y-4">
              {product.description && (
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-800 mt-1">{product.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-600">Product ID</p>
                  <p className="font-mono text-sm text-gray-800">
                    {product._id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">SKU</p>
                  <p className="font-mono text-sm text-gray-800">
                    {product.sku}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Metadata</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Created At</p>
                <p className="text-sm text-gray-800">
                  {formatDate(product.createdAt)}
                </p>
              </div>

              {product.updatedAt && (
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-sm text-gray-800">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
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
                  <strong>{product.productName}</strong> and all of its data.
                  This action cannot be undone.
                </p>
                {product.sku && (
                  <p className="mt-2 text-sm text-gray-500">
                    SKU: {product.sku}
                  </p>
                )}
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  slot="close"
                  variant="tertiary"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  slot="close"
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={deleting}
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
