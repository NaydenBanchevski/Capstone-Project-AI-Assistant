"use client";
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom"; // Make sure to import from 'react-router-dom'

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious()!;

      if (direction < 0) {
        setVisible(true);
      } else if (scrollYProgress.get() > 0.05) {
        setVisible(false);
      }
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollYProgress]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className={cn(
          "flex w-[380px] sm:w-[550px] md:w-[890px] lg:w-[1200px] fixed top-2 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-between px-10 space-x-4",
          className,
          "bg-gradient-to-r from-sky-800 to-sky-600"
        )}
      >
        <div className="flex items-center gap-5">
          <img
            src="/logo.png"
            alt="ai"
            width={25}
            className="invert"
            draggable={false}
          />
          <p className="text-white hidden md:flex hover:text-yellow-400 cursor-pointer">
            Per Scholas AI
          </p>
        </div>
        <div className="flex gap-5">
          {navItems.map((navItem, index) => (
            <a
              key={index}
              href={navItem.link}
              className={cn(
                "relative text-neutral-50 items-center flex space-x-1 hover:text-yellow-400"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </a>
          ))}
        </div>
        <div className="flex gap-2 mr-auto">
          <button
            className="border text-sm font-medium relative border-none text-white hover:text-yellow-400 h-[40px] w-[100px] rounded-full"
            onClick={() => navigate("/sign-in")}
          >
            <span>Sign In</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px h-px" />
          </button>
          <button
            className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] bg-white text-sky-800 dark:text-white hover:bg-yellow-400 h-[40px] w-[100px] rounded-full"
            onClick={() => navigate("/sign-up")}
          >
            <span>Sign Up</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
