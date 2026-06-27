"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch product details
  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/products/${productId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const data = await response.json();

      if (!data || Object.keys(data).length === 0) {
        throw new Error("Product not found");
      }

      setProduct(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load product details");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle quantity change
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle Buy Now
  const handleBuyNow = async () => {
    if (!product || product.stock === 0) {
      return;
    }

    setBuying(true);
    setError("");
    setSuccessMessage("");

    try {
      const orderData = {
        productId: product._id,
        productName: product.productName,
        quantity: quantity,
        price: product.sellingPrice,
        totalAmount: product.sellingPrice * quantity,
        supplier: product.supplier,
        status: "Pending",
        orderDate: new Date().toISOString(),
        // Add customer info if you have authentication
        customerName: "Guest User",
        customerEmail: "guest@example.com",
      };

      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const result = await response.json();

      setSuccessMessage("Order placed successfully! 🎉");

      // Redirect to orders page or show success
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
      console.error("Error placing order:", err);
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
          <img
            src={product.image || "https://placehold.co/600x400?text=No+Image"}
            alt={product.productName}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & Status */}
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
              {product.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                product.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.status === "active" ? "In Stock" : "Inactive"}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-3xl font-bold text-gray-900">
            {product.productName}
          </h1>

          {/* SKU */}
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>

          {/* Supplier */}
          <div className="flex items-center gap-2 text-gray-600">
            <Truck size={18} />
            <span>
              Supplier: <strong>{product.supplier}</strong>
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-green-600">
              ৳ {product.sellingPrice}
            </span>
            {product.purchasePrice && (
              <span className="text-lg text-gray-400 line-through">
                ৳ {product.purchasePrice}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                product.stock > 10
                  ? "bg-green-100 text-green-700"
                  : product.stock > 0
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  product.stock > 10
                    ? "bg-green-500"
                    : product.stock > 0
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              ></span>
              {product.stock > 0
                ? `${product.stock} units available`
                : "Out of Stock"}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="rounded-full border border-gray-300 p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="rounded-full border border-gray-300 p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                (Max {product.stock} units)
              </span>
            </div>
          )}

          {/* Total Price */}
          {product.stock > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ৳ {(product.sellingPrice * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0 || buying}
            className={`w-full rounded-xl py-4 font-semibold text-white transition flex items-center justify-center gap-2 ${
              product.stock > 0 && !buying
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            {buying ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                {product.stock > 0 ? "Buy Now" : "Out of Stock"}
              </>
            )}
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
              <Shield className="h-6 w-6 text-green-600 mb-1" />
              <span className="text-xs font-medium">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
              <RefreshCw className="h-6 w-6 text-blue-600 mb-1" />
              <span className="text-xs font-medium">7 Days Return</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
              <Truck className="h-6 w-6 text-purple-600 mb-1" />
              <span className="text-xs font-medium">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
