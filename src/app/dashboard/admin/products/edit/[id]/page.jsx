"use client";

import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    category: "",
    supplier: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    status: "active",
    image: "",
    description: "",
  });

  // Fetch product data
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `http://localhost:5000/products/${productId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();

      if (data) {
        setFormData({
          productName: data.productName || "",
          sku: data.sku || "",
          category: data.category || "",
          supplier: data.supplier || "",
          purchasePrice: data.purchasePrice?.toString() || "",
          sellingPrice: data.sellingPrice?.toString() || "",
          stock: data.stock?.toString() || "",
          status: data.status || "active",
          image: data.image || "",
          description: data.description || "",
        });
      }
      setError("");
    } catch (err) {
      setError("Failed to load product data. Please try again.");
      console.error("Error fetching product:", err);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (32MB max for free ImgBB)
    if (file.size > 32 * 1024 * 1024) {
      setError("Image size must be less than 32MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      // Create form data for ImgBB API
      const imageFormData = new FormData();
      imageFormData.append("image", file);

      // Replace with your ImgBB API key
      const API_KEY = "a39ff95aa0aceebbf5000666d57d646c";
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        {
          method: "POST",
          body: imageFormData,
        },
      );

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url;
        setFormData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
        setSuccess("Image uploaded successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error?.message || "Failed to upload image");
      }
    } catch (err) {
      setError("Network error while uploading image");
      console.error("Image upload error:", err);
    } finally {
      setUploadingImage(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.productName || !formData.sku || !formData.category) {
      setError("Please fill in all required fields");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            purchasePrice: parseFloat(formData.purchasePrice) || 0,
            sellingPrice: parseFloat(formData.sellingPrice) || 0,
            stock: parseInt(formData.stock) || 0,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Product updated successfully!");

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 2000);
      } else {
        setError(data.message || "Failed to update product");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error updating product:", err);
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/dashboard/products");
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  if (loading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/products"
            className="mb-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>

          <p className="mt-1 text-gray-600">
            Update product information for{" "}
            {formData.productName || "your product"}.
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              SKU <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="PRD-001"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Fashion">Fashion</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>

          {/* Supplier */}
          <div>
            <label className="mb-2 block text-sm font-medium">Supplier</label>

            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="">Select Supplier</option>
              <option value="ABC Supplier">ABC Supplier</option>
              <option value="XYZ Supplier">XYZ Supplier</option>
            </select>
          </div>

          {/* Purchase Price */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Purchase Price
            </label>

            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Selling Price */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Selling Price
            </label>

            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Stock Quantity
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Image Upload with ImgBB */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Product Image
          </label>

          {formData.image ? (
            <div className="relative rounded-2xl border-2 border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <img
                  src={formData.image}
                  alt={formData.productName}
                  className="h-32 w-32 object-cover rounded-xl border border-gray-200"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Current Image</p>
                  <p className="text-sm text-gray-500 break-all">
                    {formData.image}
                  </p>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition"
                    >
                      <Upload size={16} />
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={handleUploadClick}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-8 transition hover:border-blue-500"
            >
              <Upload className="mb-3 h-10 w-10 text-gray-400" />

              <p className="font-medium">Click to upload product image</p>

              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG, JPEG (Max 32MB)
              </p>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
                disabled={uploadingImage}
              />

              {uploadingImage && (
                <div className="mt-3 flex items-center gap-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Uploading image...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Write product description..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
