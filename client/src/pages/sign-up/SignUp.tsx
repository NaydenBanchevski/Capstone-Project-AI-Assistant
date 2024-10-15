import { SignUp } from "@clerk/clerk-react";
import { BorderBeam } from "../../components/ui/border-beam";
import { motion } from "framer-motion";
import { BackgroundBeams } from "../../components/ui/background-beams";

export default function SignUpPage() {
  return (
    <div className="relative bg-gradient-to-b overflow-hidden from-sky-500 to-sky-800 color-white">
      <BackgroundBeams className="opacity-50 " />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
        }}
        className="w-full  h-[100vh] flex  flex-col items-center "
      >
        <h2 className="text-4xl sm:mt-[200px] mt-[50px] md:text-4xl lg:text-7xl font-semibold max-w-7xl mx-auto text-center relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-sky-800/1% mb-10">
          Sign Up
        </h2>
        <div className="relative rounded-xl overflow-hidden">
          <SignUp path="/sign-up" />
          <BorderBeam
            colorFrom="#facc15"
            colorTo="#F59E0B"
            size={300}
            className="absolute z-10"
            borderWidth={2}
          />
        </div>
      </motion.div>
    </div>
  );
}
