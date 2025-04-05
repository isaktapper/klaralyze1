import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/pricing";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
    </main>
  );
}