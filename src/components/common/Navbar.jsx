"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Bell,
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  HomeIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/react";

// Define all navigation links
const allNavLinks = [
  {
    name: "Home",
    icon: <HomeIcon size={18} />,
    href: "/",
  },
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/dashboard",
  },
  {
    name: "Products",
    icon: <Package size={18} />,
    href: "/products",
  },
  {
    name: "Customers",
    icon: <Users size={18} />,
    href: "/customers",
  },
  {
    name: "Suppliers",
    icon: <Truck size={18} />,
    href: "/suppliers",
  },
  {
    name: "Sales",
    icon: <ShoppingCart size={18} />,
    href: "/sales",
  },
];

// Public links (visible when not logged in)
const publicLinks = allNavLinks.filter(
  (link) => link.name === "Home" || link.name === "Products",
);

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  // TODO: Replace this with your actual authentication logic
  // Example: const { user } = useAuth(); or const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const isLoggedIn = false; // Change this to true to test logged-in state

  // Determine which links to show based on login status
  const navLinks = isLoggedIn ? allNavLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg">
              E
            </div>

            <Link href="/">
              <h1 className="text-lg font-bold text-slate-900">Mini ERP</h1>
              <p className="text-xs text-slate-500">Business Management</p>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600"
              >
                {link.icon}
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* User Section */}
            <div className="hidden md:flex items-center gap-3 rounded-xl bg-white px-3 py-2">
              {isLoggedIn ? (
                // Logged in state
                <>
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="User"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      Admin User
                    </h4>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                  <Button variant="danger" size="sm">
                    Logout
                  </Button>
                </>
              ) : (
                // Logged out state
                <Button variant="primary" size="sm">
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="lg:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
                onClick={() => setMobileMenu(false)}
              >
                {link.icon}
                {link.name}
              </a>
            ))}

            <div className="mt-4 border-t pt-4">
              {isLoggedIn ? (
                // Logged in mobile view
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="User"
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Admin User</p>
                    <p className="text-sm text-slate-500">admin@erp.com</p>
                  </div>
                  <Button variant="danger" size="sm">
                    Logout
                  </Button>
                </div>
              ) : (
                // Logged out mobile view
                <Button variant="primary" className="w-full">
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
