import { Hero } from "../../Hero";
import { Nav } from "../../Nav";
import { motion } from "framer-motion";
import { BackgroundBeams } from "../../ui/background-beams";
import { About } from "../../About";
import { Categories } from "../../Categories";
import { Footer } from "../../Footer";

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
        id="about"
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
        id="contact"
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
