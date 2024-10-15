import { Footer } from "../../components/Footer";
import { Hero } from "../../components/Hero";
import { About } from "../../components/About";
import { Categories } from "../../components/Categories";
import { BackgroundBeams } from "../../components/ui/background-beams";
import { motion } from "framer-motion";
import { Nav } from "../../components/Nav";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const Home = () => {
  return (
    <main className="h-full flex flex-col">
      <Nav />
      <BackgroundBeams className="opacity-50" />
      <Hero />

      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ amount: 0.3 }}
        transition={{ duration: 1 }}
        variants={sectionVariants}
      >
        <About />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ amount: 0.3 }}
        transition={{ duration: 1 }}
        variants={sectionVariants}
      >
        <Categories />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ amount: 0.3 }}
        transition={{ duration: 1 }}
        variants={sectionVariants}
      >
        <Footer />
      </motion.div>
    </main>
  );
};
