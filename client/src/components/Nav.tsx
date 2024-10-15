import { navItems } from "../data/data";
import { FloatingNav } from "./ui/floating-navbar";

export const Nav = () => {
  return (
    <FloatingNav
      navItems={navItems}
      className=" max-w-[1440px] bg-transparent"
    />
  );
};
