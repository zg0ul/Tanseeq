import { User } from "@/state/api";
import Image from "next/image";
import React from "react";
import { LuBriefcase, LuMail, LuUsers } from "react-icons/lu";

type Props = {
  user: User;
  role?: string; // Optional role like "Product Manager", "Developer", etc.
  onClick?: () => void;
};

function UserCard({ user, role = "Team Member", onClick }: Props) {
  return (
    <div
      className="dark:bg-dark-secondary relative mb-3 overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:text-white"
      onClick={onClick}
    >
      {/* Top color bar - a teal color to differentiate from tasks/projects */}
      <div className="h-1 w-full bg-teal-500"></div>

      {/* Main content */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* User avatar */}
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-4 border-white dark:border-gray-700">
            {user.profilePictureUrl ? (
              <Image
                src={`/${user.profilePictureUrl}`}
                alt={user.username}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-teal-100 text-xl font-medium text-teal-600 dark:bg-teal-900 dark:text-teal-200">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex-1">
            {/* Username and role badge */}
            <div className="mb-1 flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.username}
              </h3>
              <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                {role}
              </span>
            </div>

            {/* Email */}
            <div className="mb-3 flex items-center">
              <LuMail className="mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email || "No email"}
              </p>
            </div>

            {/* Status indicators */}
            <div className="flex flex-wrap gap-2">
              {/* Team indicator - could be dynamic */}
              <div className="flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                <LuUsers className="mr-1 h-3 w-3" />
                Team {user.teamId || "Unassigned"}
              </div>

              {/* Tasks count - could be dynamic */}
              <div className="flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <LuBriefcase className="mr-1 h-3 w-3" />8 Tasks
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="dark:border-stroke-dark my-4 h-px w-full bg-gray-200 dark:border-t"></div>

        {/* Stats section */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-700">
            <p className="font-medium text-gray-900 dark:text-white">12</p>
            <p className="text-gray-500 dark:text-gray-400">Tasks</p>
          </div>
          <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-700">
            <p className="font-medium text-gray-900 dark:text-white">5</p>
            <p className="text-gray-500 dark:text-gray-400">Completed</p>
          </div>
          <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-700">
            <p className="font-medium text-gray-900 dark:text-white">3</p>
            <p className="text-gray-500 dark:text-gray-400">Projects</p>
          </div>
        </div>

        {/* Activity indicator */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Last active: 2 hours ago
          </span>
          <div className="flex h-2.5 w-2.5 rounded-full bg-green-500"></div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
