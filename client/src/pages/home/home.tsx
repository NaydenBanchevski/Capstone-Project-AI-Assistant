import { Title } from "../../components/Title";
import Safari from "../../components/ui/safari";
import { BorderBeam } from "../../components/ui/border-beam";
import { motion } from "framer-motion";

export const Home = () => {
  return (
    <div className="relative z-10" id="home">
      <section className="flex flex-col h-[120vh] w-full  relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
          className="flex w-full flex-col  items-center"
        >
          <Title />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="relative rounded-xl flex"
          >
            <BorderBeam
              colorFrom="rgb(11,138,198)"
              colorTo="orange"
              size={400}
            />
            <Safari
              url="ai-assistant-Per-Scholas.com"
              className="w-[380px] h-full sm:w-full sm:h-full"
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};
