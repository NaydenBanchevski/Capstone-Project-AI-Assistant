import { motion } from "framer-motion";
import { IconBrandTabler, IconList, IconMessage } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link
      to="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <img src="/logo.png" alt="logo" className="invert" width={20} />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white dark:text-white whitespace-pre"
      >
        AI Assistant
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img src="/logo.png" alt="logo" className="invert" width={20} />
    </Link>
  );
};

export const links = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: (
      <IconBrandTabler className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Resume",
    to: `/dashboard/resume`,
    icon: (
      <IconList className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];
