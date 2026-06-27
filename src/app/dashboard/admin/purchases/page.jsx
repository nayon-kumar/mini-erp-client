"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://mini-erp-server-two.vercel.app";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
  });
  const [deleting, setDeleting] = useState(false);

  const limit = 10;

  // Fetch order statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter && statusFilter !== "All")
        params.append("status", statusFilter);
      params.append("sort", sort);
      params.append("page", currentPage);
      params.append("limit", limit);

      const response = await fetch(`${API_URL}/orders?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
        setTotalOrders(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  // Fetch when filters change
  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, sort, currentPage]);

  // Reset page when filters change (except page)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sort]);

  // Handle delete
  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this order? Only pending orders can be deleted.",
      )
    )
      return;

    try {
      setDeleting(true);
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Refresh orders and stats
        fetchOrders();
        fetchStats();
      } else {
        setError(data.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh orders and stats
        fetchOrders();
        fetchStats();
      } else {
        setError(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusMap = {
      Pending: {
        color: "bg-yellow-100 text-yellow-700",
        icon: Clock,
        label: "Pending",
      },
      Processing: {
        color: "bg-blue-100 text-blue-700",
        icon: Truck,
        label: "Processing",
      },
      Shipped: {
        color: "bg-purple-100 text-purple-700",
        icon: Truck,
        label: "Shipped",
      },
      Delivered: {
        color: "bg-green-100 text-green-700",
        icon: CheckCircle,
        label: "Delivered",
      },
      Cancelled: {
        color: "bg-red-100 text-red-700",
        icon: XCircle,
        label: "Cancelled",
      },
    };
    return (
      statusMap[status] || {
        color: "bg-gray-100 text-gray-700",
        icon: Clock,
        label: status || "Unknown",
      }
    );
  };

  // Get status options for dropdown
  const getStatusOptions = () => {
    const statuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    return statuses.map((status) => ({
      value: status,
      label: status,
    }));
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setSort("newest");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by product or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            {getStatusOptions().map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amountLow">Amount: Low to High</option>
            <option value="amountHigh">Amount: High to Low</option>
          </select>

          <button
            onClick={handleClearFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-gray-500">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Qty</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-center p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const StatusIcon = getStatusInfo(order.status).icon;

                return (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-sm">
                      #{order._id?.slice(-6) || "N/A"}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.productName}</p>
                        {order.supplier && (
                          <p className="text-xs text-gray-500">
                            Supplier: {order.supplier}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">{order.quantity}</td>
                    <td className="p-4 font-semibold">
                      ৳{order.totalAmount?.toLocaleString() || "0"}
                    </td>
                    <td className="p-4 text-sm">
                      {formatDate(order.orderDate || order.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="relative group">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusInfo(order.status).color}`}
                        >
                          <StatusIcon size={14} />
                          {order.status}
                        </span>

                        {/* Status update dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order._id, e.target.value)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={order.status === "Cancelled"}
                        >
                          {getStatusOptions().map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleDelete(order._id)}
                          disabled={deleting || order.status !== "Pending"}
                          className={`text-red-600 hover:text-red-800 ${
                            order.status !== "Pending"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title={
                            order.status !== "Pending"
                              ? "Only pending orders can be deleted"
                              : "Delete order"
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalOrders > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * limit + 1} -{" "}
            {Math.min(currentPage * limit, totalOrders)} of {totalOrders} orders
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              {currentPage}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || loading}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
