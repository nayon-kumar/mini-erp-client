"use client";

import { Search, X } from "lucide-react";

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories = [],
  sort,
  setSort,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onClearFilters,
}) {
  // Handle search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  // Handle price range change
  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      setMaxPrice(value);
    }
  };

  // Check if any filters are active
  const hasActiveFilters =
    search || category !== "All" || minPrice || maxPrice || sort !== "newest";

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={handleCategoryChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={handleMinPriceChange}
            min="0"
            className="w-1/2 rounded-xl border border-gray-300 px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            min="0"
            className="w-1/2 rounded-xl border border-gray-300 px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Sort Options */}
        <select
          value={sort}
          onChange={handleSortChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {/* Active Filters Display & Clear Button */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
          <span className="text-sm text-gray-600">Active filters:</span>

          {search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
              Search: {search}
              <button
                onClick={() => setSearch("")}
                className="ml-1 hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </span>
          )}

          {category !== "All" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
              Category: {category}
              <button
                onClick={() => setCategory("All")}
                className="ml-1 hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </span>
          )}

          {minPrice && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
              Min: ৳{minPrice}
              <button
                onClick={() => setMinPrice("")}
                className="ml-1 hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </span>
          )}

          {maxPrice && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
              Max: ৳{maxPrice}
              <button
                onClick={() => setMaxPrice("")}
                className="ml-1 hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </span>
          )}

          {sort !== "newest" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
              Sort:{" "}
              {sort === "priceLow"
                ? "Price: Low to High"
                : sort === "priceHigh"
                  ? "Price: High to Low"
                  : sort === "oldest"
                    ? "Oldest First"
                    : "Newest First"}
              <button
                onClick={() => setSort("newest")}
                className="ml-1 hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </span>
          )}

          <button
            onClick={onClearFilters}
            className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
