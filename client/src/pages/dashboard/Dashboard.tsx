"use client";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { SignedIn, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { links, Logo, LogoIcon } from "../../components/ui/Logo";
import { HoverEffect } from "../../components/ui/card-hover-effect";
import { PlaceholdersAndVanishInput } from "../../components/ui/placeholders-and-vanish-input";
import { placeholders, tasks } from "../../data/data";
import { ResumeList } from "../../components/ResumeList";
import { ChatList } from "../../components/ChatList";

export function DashboardLayout() {
  const { userId, isLoaded } = useAuth();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row w-full mx-auto h-[100vh] dark:border-neutral-700"
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
            {open && <ChatList />}
            {open && <ResumeList />}
          </div>
          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-col overflow-y-scroll flex-1">
        <Dashboard location={location}>
          <Outlet />
        </Dashboard>
      </div>
    </div>
  );
}

const Dashboard = ({
  children,
  location,
}: {
  children: any;
  location: any;
}) => {
  const { user } = useUser();
  const username = user?.firstName || "Guest";

  const showTasks = location.pathname === "/dashboard";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1">
      <h1 className="text-2xl font-bold text-sky-800">Hello, {username}!</h1>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Welcome to AI Assistant, where you can explore coding topics, build
          your resume, and more.
        </p>
      </div>
      {showTasks ? (
        <div className="flex w-full flex-col h-full justify-center items-center relative">
          <div className="max-w-5xl mx-auto px-8">
            <HoverEffect items={tasks} />
          </div>
          <div className="w-full absolute bottom-5">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      ) : (
        <div className="flex gap-2 w-full">{children}</div>
      )}
    </div>
  );
};
