import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductsGrid from "@/components/ProductsGrid";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <Hero />
      <Categories />
      <ProductsGrid />
    </main>
  );
}
