import { Project } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LuCalendar, LuClock, LuLayoutGrid } from "react-icons/lu";

type Props = {
  project: Project;
};

function ProjectCard({ project }: Props) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="dark:bg-dark-secondary relative mb-3 overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:translate-y-[-3px] hover:shadow-md dark:text-white">
        {/* Top color bar */}
        <div className="h-1 w-full bg-blue-500"></div>

        {/* Main content */}
        <div className="p-5">
          {/* Header with ID */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              #{project.id}
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Project
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {project.name}
          </h3>

          {/* Description */}
          <p className="mb-4 text-sm text-gray-600 dark:text-neutral-500">
            {project.description || "No description provided"}
          </p>

          {/* Dates */}
          <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center rounded-md bg-gray-50 p-2 dark:bg-gray-700">
              <LuCalendar className="mr-2 text-blue-500" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Start Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {project.startDate
                    ? format(new Date(project.startDate), "PP")
                    : "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center rounded-md bg-gray-50 p-2 dark:bg-gray-700">
              <LuClock className="mr-2 text-amber-500" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">End Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {project.endDate
                    ? format(new Date(project.endDate), "PP")
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* Project progress (mock) */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Progress
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                68%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: "68%" }}
              ></div>
            </div>
          </div>

          {/* Divider */}
          <div className="dark:border-stroke-dark my-4 h-px w-full bg-gray-200 dark:border-t"></div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Tasks count (mock) */}
            <div className="flex items-center">
              <LuLayoutGrid className="mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                12 Tasks
              </span>
            </div>

            {/* Team avatars (mock) */}
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="dark:border-dark-secondary relative h-7 w-7 overflow-hidden rounded-full border-2 border-white"
                >
                  <Image
                    src={`/p${i}.jpeg`}
                    alt={`Team member ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="dark:border-dark-secondary flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +2
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
