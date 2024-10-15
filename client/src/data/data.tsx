import { IconHome, IconInfoCircle, IconPhone } from "@tabler/icons-react";

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
    link: "/dashboard/chat",
  },
  {
    title: "Resume Builder",
    description: "Build your unique resume.",
    link: "/dashboard/resume",
  },
  {
    title: "FAANG / Coming Soon!",
    description:
      "Get ready for coding challenges designed for FAANG interviews and elevate your tech skills!",
    disabled: true,
  },
];

export const placeholders = [
  "Key components of the MERN stack?",
  "Securing a REST API with JWT?",
  "Benefits of MongoDB in full-stack apps?",
  "Common cyber attacks and prevention?",
  "Basic security practices for web servers?",
  "Preventing SQL injection in Node.js?",
  "Best practices for password security?",
  "Ensuring data encryption in transit/rest?",
  "Improving performance in React apps?",
  "Difference between symmetric and asymmetric encryption?",
];
