"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  HomeIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Define all navigation links with role requirements
const allNavLinks = [
  {
    name: "Home",
    icon: <HomeIcon size={18} />,
    href: "/",
    roles: ["public"], // accessible to everyone
  },
  {
    name: "Products",
    icon: <Package size={18} />,
    href: "/products",
    roles: ["public"], // accessible to everyone
  },
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/dashboard",
    roles: ["admin", "customer", "supplier"], // all logged-in users
  },
  {
    name: "Customers",
    icon: <Users size={18} />,
    href: "/customers",
    roles: ["admin", "customer"], // admin and customer
  },
  {
    name: "Suppliers",
    icon: <Truck size={18} />,
    href: "/suppliers",
    roles: ["admin", "supplier"], // admin and supplier
  },
  {
    name: "Sales",
    icon: <ShoppingCart size={18} />,
    href: "/sales",
    roles: ["admin"], // admin only
  },
];

// Public links (visible when not logged in)
const publicLinks = allNavLinks.filter((link) => link.roles.includes("public"));

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await authClient.getSession();
        if (data?.session) {
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Get user role
  const getUserRole = () => {
    if (!user) return "";
    return user.role?.toLowerCase() || "";
  };

  // Determine which links to show based on login status and role
  const getNavLinks = () => {
    if (!isLoggedIn) {
      return publicLinks;
    }

    const userRole = getUserRole();

    // Admin can access all links except public ones (they're included anyway)
    if (userRole === "admin") {
      return allNavLinks;
    }

    // Filter links based on user role
    return allNavLinks.filter((link) => {
      // Skip public links for logged-in users (they're already shown)
      if (link.roles.includes("public")) {
        return false; // Don't show public links in nav when logged in
      }
      // Check if user role has access to this link
      return link.roles.includes(userRole);
    });
  };

  const navLinks = getNavLinks();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setIsLoggedIn(false);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U";
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  // Get user display name
  const getUserName = () => {
    if (!user) return "User";
    return user.name || user.email?.split("@")[0] || "User";
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg">
                E
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Mini ERP</h1>
                <p className="text-xs text-slate-500">Business Management</p>
              </div>
            </div>
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200"></div>
          </div>
        </div>
      </header>
    );
  }

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
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* User Section */}
            <div className="hidden md:flex items-center gap-3 px-3 py-2">
              {isLoggedIn ? (
                // Logged in state
                <>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      {getUserName()}
                    </h4>
                    <p className="text-xs text-slate-500 capitalize">
                      {getUserRole() || "User"}
                    </p>
                  </div>
                  <Button color="danger" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                // Logged out state
                <Link href="/login">
                  <Button color="primary" size="sm">
                    Login
                  </Button>
                </Link>
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
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
                onClick={() => setMobileMenu(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            <div className="mt-4 border-t pt-4">
              {isLoggedIn ? (
                // Logged in mobile view
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{getUserName()}</p>
                    <p className="text-sm text-slate-500 capitalize">
                      {getUserRole() || "User"}
                    </p>
                  </div>
                  <Button color="danger" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                // Logged out mobile view
                <Link href="/login">
                  <Button color="primary" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
