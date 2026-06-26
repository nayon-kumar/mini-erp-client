import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-xl transition">
      <div className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-5">
        <span className="text-sm text-blue-600 font-medium">
          {product.category}
        </span>

        <h2 className="text-xl font-bold mt-2">{product.name}</h2>

        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-green-600">
            ৳ {product.price}
          </span>

          <span
            className={`text-xs px-3 py-1 rounded-full ${
              product.stock > 10
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {product.stock} In Stock
          </span>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="mt-6 w-full inline-flex justify-center rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}
