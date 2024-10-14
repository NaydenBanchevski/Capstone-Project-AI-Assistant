"use client";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "../../lib/utils";
import { div } from "framer-motion/client";

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
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        // initial={{
        //   opacity: 1,
        //   y: -100,
        // }}
        // animate={{
        //   y: visible ? 0 : -100,
        //   opacity: visible ? 1 : 0,
        // }}
        // transition={{
        //   duration: 0.5,
        // }}
        className={cn(
          "flex w-[380px] sm:w-[550px] md:w-[890px] lg:w-[1200px]  fixed top-2 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-sky-800 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-between px-10 space-x-4",
          className
        )}
      >
        <div
          className="flex
         gap-5"
        >
          {navItems.map((navItem: any, index: number) => (
            <a
              key={index}
              href={navItem.link}
              className={cn(
                "relative text-neutral-50  items-center flex space-x-1 dark:hover:text-neutral-300 hover:text-neutral-200"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </a>
          ))}
        </div>
        <div className="flex gap-2 mr-auto">
          <button className="border text-sm font-medium relative border-none text-white hover:text-orange-100 h-[40px] w-[100px] rounded-full">
            <span>Login</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px  h-px" />
          </button>
          <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] bg-white text-sky-800 dark:text-white h-[40px] w-[100px] rounded-full">
            <span>Sign Up</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
