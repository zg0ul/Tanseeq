import { Task, useGetTasksQuery } from "@/state/api";
import React from "react";
import Header from "../Header";
import TaskCard from "./TaskCard";

type ListProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

function ListView({ id, setIsModalNewTaskOpen }: ListProps) {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });

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
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <button
              className="bg-blue-primary flex items-center px-3 py-2 text-white hover:bg-blue-600 rounded"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <div className="grid-cols1 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: Task) => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  );
}

export default ListView;
