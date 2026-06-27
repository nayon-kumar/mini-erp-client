import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-xl">
      {/* Product Image */}
      <div className="overflow-hidden">
        <img
          src={product.image || "https://placehold.co/600x400?text=No+Image"}
          alt={product.productName}
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
            {product.category}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              product.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.status}
          </span>
        </div>

        <h2 className="mt-3 line-clamp-2 text-xl font-bold">
          {product.productName}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Supplier: {product.supplier}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ৳ {product.sellingPrice}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              product.stock > 10
                ? "bg-green-100 text-green-700"
                : product.stock > 0
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
          </span>
        </div>

        <Link
          href={`/products/${product._id}`}
          className={`mt-6 inline-flex w-full justify-center rounded-xl py-3 font-semibold text-white transition ${
            product.stock > 0
              ? "bg-blue-600 hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          {product.stock > 0 ? "Buy Now" : "Out of Stock"}
        </Link>
      </div>
    </div>
  );
}
