"use client";

import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // API Base URL from environment variables
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://mini-erp-server-two.vercel.app";
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

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

  // Fetch suppliers from backend
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoadingSuppliers(true);
        const response = await fetch(`${API_BASE_URL}/suppliers`);

        if (!response.ok) {
          throw new Error("Failed to fetch suppliers");
        }

        const data = await response.json();

        // Assuming your suppliers API returns an array of suppliers
        // If you don't have a suppliers endpoint yet, you can use mock data
        if (data.success && data.data) {
          setSuppliers(data.data);
        } else if (Array.isArray(data)) {
          setSuppliers(data);
        } else {
          // Fallback to mock data if endpoint doesn't exist yet
          setSuppliers([
            { _id: "1", name: "ABC Supplier" },
            { _id: "2", name: "XYZ Supplier" },
            { _id: "3", name: "Tech Supply Co." },
            { _id: "4", name: "Global Imports" },
          ]);
        }
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        // Set default suppliers if API fails
        setSuppliers([
          { _id: "1", name: "ABC Supplier" },
          { _id: "2", name: "XYZ Supplier" },
          { _id: "3", name: "Tech Supply Co." },
          { _id: "4", name: "Global Imports" },
        ]);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    fetchSuppliers();
  }, [API_BASE_URL]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
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
      // Check if API key exists
      if (!IMGBB_API_KEY) {
        throw new Error("Image upload API key is not configured");
      }

      // Create form data for ImgBB API
      const imageFormData = new FormData();
      imageFormData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imageFormData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to upload image");
      }

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
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (err) {
      setError(err.message || "Failed to upload image");
      console.error("Image upload error:", err);
    } finally {
      setUploadingImage(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Validate SKU uniqueness
  const checkSkuUniqueness = async (sku) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?search=${sku}`);

      if (!response.ok) {
        return true; // If API fails, proceed with caution
      }

      const data = await response.json();

      // Check if any product has the same SKU
      if (data.products && Array.isArray(data.products)) {
        const existingProduct = data.products.find(
          (product) => product.sku.toLowerCase() === sku.toLowerCase(),
        );
        return !existingProduct;
      }

      return true;
    } catch (err) {
      console.error("Error checking SKU:", err);
      return true; // Proceed if we can't check
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.productName || !formData.sku || !formData.category) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate SKU uniqueness
    const isSkuUnique = await checkSkuUniqueness(formData.sku);
    if (!isSkuUnique) {
      setError("SKU already exists. Please use a unique SKU.");
      setLoading(false);
      return;
    }

    try {
      // Prepare product data
      const productData = {
        productName: formData.productName.trim(),
        sku: formData.sku.trim(),
        category: formData.category,
        supplier: formData.supplier || "",
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        stock: parseInt(formData.stock) || 0,
        image: formData.image || "",
        description: formData.description || "",
        status: formData.status,
      };

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();

      if (data.success) {
        setSuccess("Product added successfully!");

        // Reset form
        setFormData({
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

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/dashboard/admin/products");
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to add product");
      }
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/dashboard/admin/products");
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/admin/products"
            className="mb-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>

          <p className="mt-1 text-gray-600">
            Create a new product for your inventory.
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
            <p className="mt-1 text-xs text-gray-500">
              Must be unique. Example: PRD-001, LAP-001
            </p>
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
              <option value="Books">Books</option>
              <option value="Food">Food</option>
              <option value="Health">Health</option>
              <option value="Home">Home</option>
            </select>
          </div>

          {/* Supplier */}
          <div>
            <label className="mb-2 block text-sm font-medium">Supplier</label>

            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              disabled={loadingSuppliers}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Supplier</option>
              {loadingSuppliers ? (
                <option value="" disabled>
                  Loading suppliers...
                </option>
              ) : (
                suppliers.map((supplier) => (
                  <option
                    key={supplier._id || supplier.id}
                    value={supplier.name}
                  >
                    {supplier.name}
                  </option>
                ))
              )}
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
              Initial Stock
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

          <div
            onClick={handleUploadClick}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-8 transition hover:border-blue-500 hover:bg-gray-50"
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

          {formData.image && (
            <div className="mt-4 flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <img
                src={formData.image}
                alt="Product preview"
                className="h-20 w-20 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-700">
                  Image uploaded successfully!
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {formData.image}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image: "" }));
                  }}
                  className="mt-1 text-sm text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
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
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 resize-y min-h-[100px]"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[150px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Product"
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading || uploadingImage}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
