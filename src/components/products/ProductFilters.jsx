"use client";

export default function ProductFilters() {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <input
          type="text"
          placeholder="Search products..."
          className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select className="border rounded-xl px-4 py-3">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Furniture</option>
          <option>Stationery</option>
        </select>

        <select className="border rounded-xl px-4 py-3">
          <option>All Prices</option>
          <option>Under ৳500</option>
          <option>৳500 - ৳2000</option>
          <option>Above ৳2000</option>
        </select>

        <select className="border rounded-xl px-4 py-3">
          <option>Newest</option>
          <option>Price Low → High</option>
          <option>Price High → Low</option>
        </select>
      </div>
    </div>
  );
}
