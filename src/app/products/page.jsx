import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";

const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 899,
    stock: 18,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
  },
  {
    id: 2,
    name: "Gaming Keyboard",
    category: "Electronics",
    price: 1999,
    stock: 6,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600",
  },
  {
    id: 3,
    name: "Office Chair",
    category: "Furniture",
    price: 6999,
    stock: 12,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
  },
  {
    id: 4,
    name: "Notebook",
    category: "Stationery",
    price: 120,
    stock: 60,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600",
  },
];

export default function ProductsPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Our Products</h1>
        <p className="text-gray-500 mt-2">Browse all available products.</p>
      </div>

      <ProductFilters />

      <p className="mt-8 mb-5 text-gray-600">
        {products.length} Products Found
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
