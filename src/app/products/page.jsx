"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 12;

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (category !== "All") params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      params.append("sort", sort);
      params.append("page", page);
      params.append("limit", limit);

      const res = await fetch(`${API_URL}/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotal(data.total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, minPrice, maxPrice, sort, page]);

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
        sort={sort}
        setSort={setSort}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      <p className="mt-8 mb-5 text-gray-600">{total} Products Found</p>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold">No Products Found</h3>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}

      <div className="flex justify-center mt-10 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 rounded border disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2 font-semibold">Page {page}</span>

        <button
          disabled={page * limit >= total}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
