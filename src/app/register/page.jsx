import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register - Mini ERP",
  description:
    "A modern ERP solution for managing products, customers, suppliers, purchases, sales, inventory, invoices, and business reports through a centralized dashboard.",
};

const RegisterPage = () => {
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
