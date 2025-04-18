"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconType } from "react-icons/lib";
import {
  LuBriefcase,
  LuChevronDown,
  LuChevronUp,
  LuCircleAlert,
  LuHouse,
  LuLayers3,
  LuLock,
  LuOctagonAlert,
  LuSearch,
  LuSettings,
  LuShieldAlert,
  LuTriangleAlert,
  LuUser,
  LuUsers,
  LuX,
} from "react-icons/lu";
import { twMerge } from "tailwind-merge";

function SideBar() {
  const [showProjects, setshowProjects] = useState(true);
  const [showPriority, setshowPriority] = useState(true);

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const sidebarClassNames = twMerge(
    "fixed flex flex-col h-full justify-between shadow-xl transition-all duration-300 h-[100%] z-40 dark:bg-black overflow-y-hidden bg-white transition-all duration-500 ease-in-out ",
    isSidebarCollapsed ? "w-0 hidden" : "w-64",
  );

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            Tanseeq
          </div>
          {isSidebarCollapsed ? null : (
            <button
              onClick={() =>
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
              }
              className="cursor-pointer py-3"
            >
              <LuX className="size-6 cursor-pointer text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>
        {/* TEAM */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src="/icon.png" alt="logo" width={40} height={40} />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              ZG0UL TEAM
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LuLock className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        {/* NAVBAR LINKS */}
        <nav className="z-10 w-full">
          <SidebarLink icon={LuHouse} label="home" href="/" />
          <SidebarLink icon={LuBriefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={LuSearch} label="Search" href="/search" />
          <SidebarLink icon={LuSettings} label="Settings" href="/settings" />
          <SidebarLink icon={LuUser} label="User" href="/users" />
          <SidebarLink icon={LuUsers} label="Teams" href="/teams" />
        </nav>

        {/* Projects Links */}
        <button
          onClick={() => setshowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Projects</span>
          {showProjects ? (
            <LuChevronUp className="h-5 w-5" />
          ) : (
            <LuChevronDown className="h-5 w-5" />
          )}
        </button>
        {/* Projects List */}

        {/* Priorities links */}
        <button
          onClick={() => setshowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Priority</span>
          {showPriority ? (
            <LuChevronUp className="h-5 w-5" />
          ) : (
            <LuChevronDown className="h-5 w-5" />
          )}
        </button>
        {showPriority && (
          <>
            <SidebarLink
              icon={LuCircleAlert}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={LuShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidebarLink
              icon={LuTriangleAlert}
              label="Medium"
              href="/priority/medium"
            />
            <SidebarLink
              icon={LuOctagonAlert}
              label="Low"
              href="/priority/low"
            />
            <SidebarLink
              icon={LuLayers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )}
      </div>
    </div>
  );
}

interface sidebarLinksProps {
  href: string;
  icon: IconType;
  label: string;
  //   isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  //   isCollapsed,
}: sidebarLinksProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={twMerge(
          `relative flex cursor-pointer items-center justify-start gap-3 px-8 py-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700`,
          isActive ? "bg-gray-100 text-white dark:bg-gray-600" : "",
        )}
      >
        {isActive && (
          <div className="w-5px absolute top-0 left-0 h-full bg-blue-200" />
        )}
        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {label}
        </span>
      </div>
    </Link>
  );
};

export default SideBar;
