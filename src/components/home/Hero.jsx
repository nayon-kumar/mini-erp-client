import Link from "next/link";
import { BarChart3, Package, Users, Truck, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
            <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
              🚀 Smart ERP Solution
            </span>

            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight text-white">
              Simplify Your
              <span className="block text-blue-500">Business Management</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Manage products, customers, suppliers, purchases, sales,
              inventory, invoices, and reports from a single dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Login
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white">10K+</h3>
                <p className="text-sm text-slate-400">Products</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">5K+</h3>
                <p className="text-sm text-slate-400">Customers</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">99%</h3>
                <p className="text-sm text-slate-400">Accuracy</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <Package className="mb-3 text-blue-500" size={36} />
                  <h3 className="font-semibold text-white">Products</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Inventory tracking and stock management.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <Users className="mb-3 text-green-500" size={36} />
                  <h3 className="font-semibold text-white">Customers</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Manage customer information efficiently.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <Truck className="mb-3 text-orange-500" size={36} />
                  <h3 className="font-semibold text-white">Suppliers</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Organize supplier records and purchases.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <BarChart3 className="mb-3 text-purple-500" size={36} />
                  <h3 className="font-semibold text-white">Reports</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Analytics and business insights.
                  </p>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <p className="text-sm text-blue-100">Monthly Revenue</p>
                <h2 className="mt-2 text-3xl font-bold text-white">$24,560</h2>
                <p className="mt-1 text-sm text-blue-100">
                  +18% growth from last month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
