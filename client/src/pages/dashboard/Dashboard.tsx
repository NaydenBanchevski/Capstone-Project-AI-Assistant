"use client";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { SignedIn, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";
import { links, Logo, LogoIcon } from "../../components/ui/Logo";

export function DashboardLayout() {
  const { userId, isLoaded } = useAuth();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row w-full h-[100vh] mx-auto dark:border-neutral-700 overflow-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-col flex-1">
        <Dashboard>
          <Outlet />
        </Dashboard>
      </div>
    </div>
  );
}

const Dashboard = ({ children }: { children: any }) => {
  const { user } = useUser();
  console.log(user);
  const username = user?.firstName || "Guest";
  return (
    <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1">
      <img
        src={user?.imageUrl}
        alt="profile"
        width={100}
        className="rounded-full border-5 border-sky-800"
      />
      <h1 className="text-2xl font-bold text-sky-800">Hello, {username}!</h1>
      <div className="flex gap-2 flex-1">{children}</div>
    </div>
  );
};
