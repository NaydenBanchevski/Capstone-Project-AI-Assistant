"use client";
import { useEffect, useState } from "react";

import { SignedIn, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import { IconArrowRight } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar, SidebarBody, SidebarLink } from "../../ui/sidebar";
import { links, Logo, LogoIcon } from "../../ui/Logo";
import { ChatList } from "../../ChatList";
import { ResumeList } from "../../ResumeList";
import { HoverEffect } from "../../ui/card-hover-effect";
import { cn } from "../../../lib/utils";
import { tasks } from "../../../data/data";

export function DashboardLayout() {
  const { userId, isLoaded } = useAuth();
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
    if (user && userId) {
      navigate("/dashboard");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return;

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

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const showTasks = location.pathname === "/dashboard";

  const mutation = useMutation({
    mutationFn: (text: string) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`chat/${id}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;

    if (!text) return;

    mutation.mutate(text);
  };

  return (
    <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1">
      <div className="ml-[200px]">
        <h1 className="text-2xl font-bold text-sky-800">Hello, {username}!</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Welcome to AI Assistant, where you can explore coding topics, build
          your resume, and more.
        </p>
      </div>
      {showTasks ? (
        <div className="flex w-full flex-col h-full items-center justify-start  relative">
          <div className="max-w-5xl mx-auto px-8">
            <HoverEffect items={tasks} />
          </div>
          <div className=" flex  absolute bottom-5">
            <form
              className="flex bg-gradient-to-r rounded-2xl w-[300px] md:w-[400px] lg:w-[600px] xl:w-[800px] from-sky-500 to-sky-800 justify-between items-center"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="text"
                placeholder="Message Assistant"
                className="bg-transparent p-3 pl-6 w-full text-white outline-none placeholder:text-white/50 autofill:rounded-2xl"
              />
              <button
                type="submit"
                className=" text-white px-4 py-2 rounded-md"
              >
                <IconArrowRight width={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 w-full">{children}</div>
      )}
    </div>
  );
};
