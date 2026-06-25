import {
  ShieldCheck,
  BarChart3,
  Clock3,
  PackageCheck,
  Users,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description:
      "Your business data is protected with modern security practices and reliable system architecture.",
  },
  {
    icon: PackageCheck,
    title: "Smart Inventory Control",
    description:
      "Automatically track stock levels, purchases, and sales without manual calculations.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Reports",
    description:
      "Get instant insights into sales, revenue, products, customers, and suppliers.",
  },
  {
    icon: Clock3,
    title: "Save Time",
    description:
      "Reduce paperwork and repetitive tasks through streamlined business operations.",
  },
  {
    icon: Users,
    title: "Customer & Supplier Management",
    description:
      "Maintain organized records and build stronger business relationships.",
  },
  {
    icon: TrendingUp,
    title: "Business Growth",
    description:
      "Make data-driven decisions with powerful analytics and performance tracking.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
            Why Choose Us
          </span>

          <h2 className="mt-5 text-4xl font-bold text-white">
            Everything You Need to Run Your Business Efficiently
          </h2>

          <p className="mt-4 text-slate-400 text-lg">
            Our ERP solution helps businesses manage inventory, customers,
            suppliers, sales, and reports from one centralized platform.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-slate-900"
              >
                <div className="inline-flex rounded-2xl bg-blue-500/10 p-4 text-blue-500">
                  <Icon size={28} />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
