import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login - Mini ERP",
  description:
    "A modern ERP solution for managing products, customers, suppliers, purchases, sales, inventory, invoices, and business reports through a centralized dashboard.",
};

const page = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default page;
