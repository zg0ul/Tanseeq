import { Priority, Status, Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

type Props = {
  task: Task;
};

function TaskCard({ task }: Props) {
  // Function to determine priority badge color - matching BoardView
  const getPriorityColor = (priority?: Priority) => {
    switch (priority) {
      case Priority.Urgent:
        return "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200";
      case Priority.High:
        return "bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200";
      case Priority.Medium:
        return "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-200";
      case Priority.Low:
        return "bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200";
      case Priority.Backlog:
        return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  // Status colors matching BoardView
  const getStatusColor = (status?: Status) => {
    switch (status) {
      case Status.ToDo:
        return "#2563EB"; // Blue
      case Status.WorkInProgress:
        return "#059669"; // Green
      case Status.UnderReview:
        return "#D97706"; // Amber
      case Status.Completed:
        return "#000000"; // Black
      default:
        return "#6B7280"; // Gray
    }
  };

  const formatTagsArray = (tags?: string) => {
    if (!tags) return [];
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  };

  return (
    <div className="dark:bg-dark-secondary relative mb-3 overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:text-white">
      {/* Top status bar - visual indicator of status matching BoardView colors */}
      {task.status && (
        <div
          className="h-1 w-full"
          style={{ backgroundColor: getStatusColor(task.status) }}
        ></div>
      )}

      {/* Main content */}
      <div className="p-5">
        {/* Header with ID and Priority */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            #{task.id}
          </span>
          {task.priority && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(
                task.priority,
              )}`}
            >
              {task.priority}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {task.title}
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm text-gray-600 dark:text-neutral-500">
          {task.description || "No description provided"}
        </p>

        {/* Tags - updated to match BoardView style */}
        {task.tags && (
          <div className="mb-3 flex flex-wrap gap-1">
            {formatTagsArray(task.tags).map((tag, index) => (
              <span
                key={index}
                className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Status - using a colored badge that matches BoardView colors */}
        <div className="mb-4">
          <span
            className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: getStatusColor(task.status) }}
          >
            {task.status || "No status"}
          </span>
        </div>

        {/* Dates */}
        <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-700">
            <p className="text-gray-500 dark:text-gray-400">Start Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {task.startDate
                ? format(new Date(task.startDate), "P")
                : "Not set"}
            </p>
          </div>
          <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-700">
            <p className="text-gray-500 dark:text-gray-400">Due Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}
            </p>
          </div>
        </div>

        {/* Attachments preview */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Attachments
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {task.attachments.map((attachment, idx) => (
                <div
                  key={idx}
                  className="relative h-20 w-20 min-w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <Image
                    src={`/${attachment.fileURL}`}
                    alt={attachment.fileName || `Attachment ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider - matching BoardView style */}
        <div className="dark:border-stroke-dark my-4 h-px w-full bg-gray-200 dark:border-t"></div>

        {/* User information section */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Author - Following BoardView style for user display */}
          <div className="flex items-center">
            <div className="dark:border-dark-secondary relative mr-2 h-8 w-8 overflow-hidden rounded-full border-2 border-white">
              {task.author?.profilePictureUrl ? (
                <Image
                  src={`/${task.author.profilePictureUrl}`}
                  alt={task.author.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-100 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  {task.author?.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created by
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {task.author ? task.author.username : "Unknown"}
              </p>
            </div>
          </div>

          {/* Assignee */}
          <div className="flex items-center">
            {task.assignee ? (
              <>
                <div className="dark:border-dark-secondary relative mr-2 h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  {task.assignee.profilePictureUrl ? (
                    <Image
                      src={`/${task.assignee.profilePictureUrl}`}
                      alt={task.assignee.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-green-100 text-sm font-medium text-green-600 dark:bg-green-900 dark:text-green-300">
                      {task.assignee.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Assigned to
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.assignee.username}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <span className="inline-flex items-center rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-600 dark:border-gray-600 dark:text-gray-400">
                  Unassigned
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
