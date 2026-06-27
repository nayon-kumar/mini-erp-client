"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/products/categories`);
      const data = await res.json();

      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (category && category !== "All") params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      params.append("sort", sort);
      params.append("page", page);
      params.append("limit", limit);

      const res = await fetch(`${API_URL}/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [search, category, minPrice, maxPrice, sort, page]);

  // Reset page when filters change (except page)
  useEffect(() => {
    setPage(1);
  }, [search, category, minPrice, maxPrice, sort]);

  // Handle clear filters
  const handleClearFilters = () => {
    setSearch("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Our Products</h1>
        <p className="text-gray-500 mt-2">Browse all available products.</p>
      </div>

      <ProductFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        sort={sort}
        setSort={setSort}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onClearFilters={handleClearFilters}
      />

      <div className="mt-8 flex items-center justify-between">
        <p className="text-gray-600">{total} Products Found</p>
        {loading && <span className="text-sm text-gray-500">Loading...</span>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-700">
            No Products Found
          </h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex justify-center items-center mt-10 gap-2">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-2 px-4">
            <span className="font-semibold">{page}</span>
            <span className="text-gray-400">of</span>
            <span className="font-semibold">{Math.ceil(total / limit)}</span>
          </div>

          <button
            disabled={page >= Math.ceil(total / limit) || loading}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
