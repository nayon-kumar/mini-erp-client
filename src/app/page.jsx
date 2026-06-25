import WhyChooseUs from "@/components/home/WhyChooseUs";
import Hero from "../components/home/Hero";
import ProductsSection from "@/components/home/ProductsSection";

export default function Home() {
  return (
    <div>
      <main>
        <Hero />
        <ProductsSection />
        <WhyChooseUs />
      </main>
    </div>
  );
}
