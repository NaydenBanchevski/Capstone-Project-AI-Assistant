import { motion } from "framer-motion";
import { Title } from "./Title";
import { WobbleCard } from "./ui/wobble-card";

export const About = () => {
  return (
    <section
      className="h-full flex justify-center w-full mb-[100px] "
      id="about"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
        }}
        className="flex flex-col  max-w-[1240px] items-center mt-0 h-full w-full"
      >
        <Title header="About" subtext="Your AI Assistant" scale="75" />

        <motion.div className="">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
            <WobbleCard
              containerClassName="col-span-1 lg:col-span-2 h-full bg-sky-800 min-h-[500px] lg:min-h-[300px] shadow-lg"
              className=""
            >
              <div className="max-w-xs">
                <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                  Meet Your New AI Assistant
                </h2>
                <p className="mt-4 text-left text-base/6 text-neutral-200">
                  Your AI assistant is here to help with everything—from quick
                  answers to building your resume. It's designed to make your
                  day simpler and more productive.
                </p>
              </div>
              <img
                src="/ai.png"
                width={500}
                height={500}
                alt="AI assistant demo"
                className="absolute right-0 lg:-right-[15%] -bottom-10 object-contain rounded-2xl"
              />
            </WobbleCard>

            <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-sky-700 shadow-lg">
              <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Simple Resume Builder
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                Need a resume fast? Your AI assistant can help you craft a
                professional resume in minutes, with just the right details.
              </p>
            </WobbleCard>

            <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] shadow-lg">
              <div className="max-w-sm">
                <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                  Start Using Your AI Assistant Today
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                  Whether you’re managing tasks, building a resume, or simply
                  looking for quick help, your AI assistant is ready. Get
                  started now!
                </p>
              </div>
              <img
                src="/ai.png"
                width={500}
                height={500}
                alt="AI assistant features"
                className="absolute  md:right-[40%] lg:right-16 -bottom-10 object-contain rounded-2xl"
              />
            </WobbleCard>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
