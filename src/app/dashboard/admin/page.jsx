import {
  Package,
  Users,
  Truck,
  ShoppingCart,
  DollarSign,
  BarChart3,
} from "lucide-react";

const stats = [
  {
    title: "Total Products",
    value: "1,250",
    icon: Package,
  },
  {
    title: "Customers",
    value: "450",
    icon: Users,
  },
  {
    title: "Suppliers",
    value: "75",
    icon: Truck,
  },
  {
    title: "Purchases",
    value: "860",
    icon: ShoppingCart,
  },
  {
    title: "Sales",
    value: "1,120",
    icon: BarChart3,
  },
  {
    title: "Revenue",
    value: "$24,500",
    icon: DollarSign,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening in your business today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {item.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-blue-100 p-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Activities</h2>

          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="font-medium">
                New product added: Wireless Headphone
              </p>
              <p className="text-sm text-gray-500">5 minutes ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="font-medium">
                New sale completed for Invoice #INV-1001
              </p>
              <p className="text-sm text-gray-500">20 minutes ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="font-medium">
                Supplier delivered 150 units of Product A
              </p>
              <p className="text-sm text-gray-500">1 hour ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="font-medium">Customer registration completed</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
