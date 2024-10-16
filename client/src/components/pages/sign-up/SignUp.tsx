import { SignUp, useAuth } from "@clerk/clerk-react";

import { motion } from "framer-motion";

import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { BackgroundBeams } from "../../ui/background-beams";
import { BorderBeam } from "../../ui/border-beam";
export default function SignUpPage() {
  const { userId, isLoaded } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const error = query.get("error");

    if (error) {
      console.error("SSO Error:", error);
    }

    if (isLoaded && userId) {
      navigate("/dashboard");
    }
  }, [isLoaded, userId, location, navigate]);

  return (
    <div className="relative h-full min-h-[100vh] bg-gradient-to-b  from-sky-500 to-sky-800 color-white">
      <BackgroundBeams className="opacity-50 " />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
        }}
        className="w-full   flex  flex-col items-center "
      >
        <h2 className="text-4xl sm:mt-[100px]  mt-[50px] md:text-4xl lg:text-7xl font-semibold max-w-7xl mx-auto text-center relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-sky-800/1% mb-10">
          Sign Up
        </h2>
        <div className="relative overflow-hidden rounded-xl ">
          <SignUp path="/sign-up" />
          <BorderBeam
            colorFrom="#facc15"
            colorTo="#F59E0B"
            size={300}
            className="absolute z-10"
            borderWidth={2}
          />
        </div>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            delay: 1,
          }}
          className="border text-sm z-50 m-5 px- font-medium relative border-neutral-200 dark:border-white/[0.2] bg-white text-sky-800 dark:text-white hover:bg-yellow-400 h-[40px] w-[150px] rounded-full"
          onClick={() => navigate("/")}
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}
