import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { FloatingNav } from "./ui/floating-navbar";

const navItems = [
  {
    name: "Home",
    link: "#home",
    icon: <IconHome className="h-4 w-4 text-white" />,
  },
  {
    name: "About",
    link: "/about",
    icon: <IconUser className="h-4 w-4 text-white" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: <IconMessage className="h-4 w-4 text-white" />,
  },
];

export const Nav = () => {
  return <FloatingNav navItems={navItems} />;
};
