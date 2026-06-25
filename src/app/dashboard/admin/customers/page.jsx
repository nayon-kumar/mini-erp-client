"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Pencil, Trash2, Mail, Phone } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch customers from API
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/users/role/customer");

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();

      if (data.success) {
        // Map the API response to match your UI structure
        const mappedCustomers = data.data.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "N/A", // Default if phone doesn't exist
          totalOrders: user.totalOrders || 0, // Default if not in schema
          status: user.status || "Active", // Default status
          emailVerified: user.emailVerified,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
        setCustomers(mappedCustomers);
      } else {
        throw new Error(data.message || "Failed to fetch customers");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete customer
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Remove from UI
        setCustomers(customers.filter((customer) => customer.id !== id));
        alert("Customer deleted successfully!");
      } else {
        alert(data.message || "Failed to delete customer");
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert("Error deleting customer");
    }
  };

  // Handle search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={fetchCustomers}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">
            Manage all customers and their information.
          </p>
          <span className="text-sm text-gray-500">
            Total Customers: {customers.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search customer by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        {filteredCustomers.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "No customers found matching your search"
                : "No customers found"}
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Customer</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Orders</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">
                        {customer.emailVerified ? "✓ Verified" : "Unverified"}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      {customer.email}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-medium">{customer.totalOrders}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/dashboard/admin/customers/edit/${customer.id}`}
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-100"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
