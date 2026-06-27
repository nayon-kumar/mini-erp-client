"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Users,
  Truck,
  ShoppingCart,
  DollarSign,
  BarChart3,
} from "lucide-react";
import axios from "axios";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([
    {
      title: "Total Products",
      value: "0",
      icon: Package,
    },
    {
      title: "Customers",
      value: "0",
      icon: Users,
    },
    {
      title: "Suppliers",
      value: "0",
      icon: Truck,
    },
    {
      title: "Purchases",
      value: "0",
      icon: ShoppingCart,
    },
    {
      title: "Sales",
      value: "0",
      icon: BarChart3,
    },
    {
      title: "Revenue",
      value: "$0",
      icon: DollarSign,
    },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL;

      // Fetch dashboard data and products count in parallel
      const [dashboardResponse, productsResponse] = await Promise.all([
        axios.get(`${baseURL}/reports/dashboard`),
        axios.get(`${baseURL}/products?limit=1`), // Just to get the total count
      ]);

      const dashboardData = dashboardResponse.data.data;

      // Get total active products from products endpoint
      const totalActiveProducts = productsResponse.data.total || 0;

      // Update stats with real data
      setStats([
        {
          title: "Total Products",
          value: totalActiveProducts.toString(),
          icon: Package,
        },
        {
          title: "Customers",
          value: dashboardData.totalCustomers?.toString() || "0",
          icon: Users,
        },
        {
          title: "Suppliers",
          value: dashboardData.totalSuppliers?.toString() || "0",
          icon: Truck,
        },
        {
          title: "Purchases",
          value: dashboardData.totalPurchases?.toString() || "0",
          icon: ShoppingCart,
        },
        {
          title: "Sales",
          value: dashboardData.totalOrders?.toString() || "0",
          icon: BarChart3,
        },
        {
          title: "Revenue",
          value: `$${dashboardData.totalRevenue?.toLocaleString() || "0"}`,
          icon: DollarSign,
        },
      ]);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-gray-600">Loading your dashboard data...</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's what's happening in your business today.
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening in your business today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {item.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-blue-100 p-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
