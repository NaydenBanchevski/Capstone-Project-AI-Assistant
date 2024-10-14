import { Footer } from "../../components/Footer";
import { Hero } from "../../components/Hero";
import { About } from "../../components/About";

export const Home = () => {
  return (
    <main className="h-full flex flex-col">
      <Hero />
      <About />
      <Footer />
    </main>
  );
};
