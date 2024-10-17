import { IconHome, IconInfoCircle, IconPhone } from "@tabler/icons-react";
import { v4 as uuidV4 } from "uuid";

export const navItems = [
  {
    name: "Home",
    link: "#home",
    icon: <IconHome className="h-4 w-4 text-white" />,
  },
  {
    name: "About",
    link: "/#about",
    icon: <IconInfoCircle className="h-4 w-4 text-white" />,
  },
  {
    name: "Contact",
    link: "/#contact",
    icon: <IconPhone className="h-4 w-4 text-white" />,
  },
];

export const tasks = [
  {
    title: "Chat",
    description: "Start learning with AI Assistant.",
    link: `/dashboard`,
  },
  {
    title: "Resume Builder",
    description: "Build your unique resume.",
    link: `/dashboard/resume/${uuidV4()}`,
  },
  {
    title: "FAANG / Coming Soon!",
    description:
      "Get ready for coding challenges designed for FAANG interviews and elevate your tech skills!",
    disabled: true,
  },
];
