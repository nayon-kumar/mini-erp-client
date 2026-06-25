import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    category: "Electronics",
    price: "$25",
    stock: 120,
  },
  {
    id: 2,
    name: "Office Chair",
    category: "Furniture",
    price: "$120",
    stock: 35,
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: "$80",
    stock: 60,
  },
];

const ProductsSection = () => {
  return (
    <section className="bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
              Our Products
            </span>

            <h2 className="mt-4 text-4xl font-bold text-white">
              Recently Added Products
            </h2>

            <p className="mt-3 text-slate-400 max-w-2xl">
              Explore the latest products added to our inventory management
              system.
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
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group rounded-3xl border border-slate-800 bg-slate-950 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500">
                <Package size={32} />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                {product.name}
              </h3>

              <p className="mt-2 text-slate-400">
                Category: {product.category}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="text-lg font-bold text-white">
                    {product.price}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500">Stock</p>
                  <p className="text-lg font-bold text-green-400">
                    {product.stock}
                  </p>
                </div>
              </div>

              <button className="mt-6 w-full rounded-xl bg-slate-800 py-3 text-white transition hover:bg-blue-600">
                View Details
              </button>
            </div>
          ))}
        </div>

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
