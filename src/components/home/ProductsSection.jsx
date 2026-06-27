"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Package, Loader2 } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://mini-erp-server-two.vercel.app";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_URL}/products/featured`);

        if (!response.ok) {
          throw new Error("Failed to fetch featured products");
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.products || []);
        } else {
          setProducts([]);
          setError(data.message || "No featured products available");
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load featured products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Function to get stock status color
  const getStockColor = (stock) => {
    if (stock > 10) return "text-green-400";
    if (stock > 0) return "text-yellow-400";
    return "text-red-400";
  };

  // Function to get stock label
  const getStockLabel = (stock) => {
    if (stock > 10) return `${stock} in stock`;
    if (stock > 0) return `Only ${stock} left`;
    return "Out of stock";
  };

  return (
    <section className="bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
              Featured Products
            </span>

            <h2 className="mt-4 text-4xl font-bold text-white">
              Featured Products
            </h2>

            <p className="mt-3 text-slate-400 max-w-2xl">
              Explore our handpicked featured products from our inventory
              management system.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
          >
            Show More
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Product Cards */}
        {loading ? (
          <div className="mt-12 flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
              <p className="text-slate-400">Loading featured products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-12 text-center py-20">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-blue-400 hover:text-blue-300 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-12 text-center py-20">
            <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No featured products available</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <div
                key={product._id || product.id}
                className="group rounded-3xl border border-slate-800 bg-slate-950 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40"
              >
                {/* Product Image or Icon */}
                <div className="relative">
                  {product.image ? (
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-full h-48 object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500">
                      <Package size={32} />
                    </div>
                  )}
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white line-clamp-1">
                  {product.productName}
                </h3>

                <p className="mt-2 text-slate-400">
                  Category: {product.category}
                </p>

                {product.supplier && (
                  <p className="text-sm text-slate-500 mt-1">
                    Supplier: {product.supplier}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Price</p>
                    <p className="text-lg font-bold text-white">
                      ৳ {product.sellingPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">Stock</p>
                    <p
                      className={`text-lg font-bold ${getStockColor(product.stock)}`}
                    >
                      {getStockLabel(product.stock)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/products/${product._id}`}
                  className="mt-6 w-full rounded-xl bg-slate-800 py-3 text-white text-center transition hover:bg-blue-600 inline-block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
