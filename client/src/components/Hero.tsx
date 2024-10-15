import { motion } from "framer-motion";
import { Title } from "./Title";
import Safari from "./ui/safari";
import { BorderBeam } from "./ui/border-beam";
export const Hero = () => {
  return (
    <section
      id="home"
      className="flex flex-col h-full mt-[200px] w-full relative"
    >
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
        <Title header="Per Scholas" subtext=" Ai Assistant" />
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
          <BorderBeam colorFrom="rgb(11,138,198)" colorTo="green" size={400} />
          <Safari
            url="ai-assistant-Per-Scholas.com"
            className="w-[380px] h-full sm:w-full sm:h-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
