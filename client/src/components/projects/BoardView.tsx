import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import {
  LuEllipsisVertical,
  LuMessageSquareMore,
  LuPlus,
} from "react-icons/lu";
import { format } from "date-fns";
import Image from "next/image";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

function BoardView({ id, setIsModalNewTaskOpen }: BoardProps) {
  const {
    data: tasks, // extract the data and name it as tasks
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  function moveTask(taskId: number, newStatus: string) {
    updateTaskStatus({ taskId, status: newStatus });
  }

  if (isLoading)
    return (
      <div className="justify-center text-black dark:text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="justify-center text-black dark:text-white">
        An error occurred while fetching tasks
      </div>
    );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
}

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, newStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

function TaskColumn({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl-py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="dark:bg-dark-secondary flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            <span className="dark:bg-dark-tertiary ml-3 inline-block h-[1.5rem] w-[1.5rem] rounded-full bg-gray-200 p-1 text-center text-sm leading-none">
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <LuEllipsisVertical size={26} />
            </button>
            <button
              className="dark:bg-dark-tertiary flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <LuPlus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
}

type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`dark:bg-dark-secondary mb-4 rounded-md bg-white shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
            <LuEllipsisVertical size={26} />
          </button>
        </div>

        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
        <div className="dark:border-stroke-dark mt-4 border-t border-gray-200" />

        {/* Users */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignee && (
              <Image
                key={task.assignee.userId}
                src={`/${task.assignee.profilePictureUrl!}`}
                alt={task.assignee.username}
                width={30}
                height={30}
                className="dark:border-dark-secondary h-8 w-8 rounded-full border-2 border-white object-cover"
              />
            )}
            {task.author && (
              <Image
                key={task.author.userId}
                src={`/${task.author.profilePictureUrl!}`}
                alt={task.author.username}
                width={30}
                height={30}
                className="dark:border-dark-secondary h-8 w-8 rounded-full border-2 border-white object-cover"
              />
            )}
          </div>
          <div className="flex items-center text-gray-500 dark:text-neutral-500">
            <LuMessageSquareMore size={20} />
            <span className="ml-1 text-sm dark:text-neutral-400">
              {numberOfComments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;

const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => {
  const priorityClasses: Record<string, string> = {
    Urgent: "bg-red-200 text-red-700",
    High: "bg-yellow-200 text-yellow-700",
    Medium: "bg-green-200 text-green-700",
    Low: "bg-blue-200 text-blue-700",
    default: "bg-gray-200 text-gray-700",
  };

  return (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority
          ? priorityClasses[priority] || priorityClasses.default
          : priorityClasses.default
      }`}
    >
      {priority}
    </div>
  );
};
