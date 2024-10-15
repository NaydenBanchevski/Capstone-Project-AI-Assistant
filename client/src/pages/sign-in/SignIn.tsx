import { SignIn, useAuth } from "@clerk/clerk-react";
import { BackgroundBeams } from "../../components/ui/background-beams";
import { motion } from "framer-motion";
import { BorderBeam } from "../../components/ui/border-beam";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function SignInPage() {
  const { userId, isLoaded } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const error = query.get("error");

    if (error) {
      console.error("SSO Error:", error);
    }
    if (isLoaded && userId) {
      navigate("/dashboard");
    }
  }, [isLoaded, userId, location]);

  const navigate = useNavigate();
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
          Sign In
        </h2>
        <div className="relative rounded-xl overflow-hidden">
          <SignIn path="/sign-in" forceRedirectUrl="/dashboard" />
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
