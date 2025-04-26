import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import Header from "../Header";
import { dataGridSxStyles } from "@/lib/utils";
import Image from "next/image";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => {
      // Match status colors to BoardView
      const statusColor: { [key: string]: { bg: string; text: string } } = {
        "To Do": { bg: "#2563EB", text: "white" },
        "Work In Progress": { bg: "#059669", text: "white" },
        "Under Review": { bg: "#D97706", text: "white" },
        Completed: { bg: "#000000", text: "white" },
      };

      // Default to gray if status not found
      const color = statusColor[params.value as string] || {
        bg: "#6B7280",
        text: "white",
      };

      return (
        <span
          className="inline-flex rounded-md px-2 py-1 text-xs font-semibold"
          style={{
            backgroundColor: color.bg,
            color: color.text,
          }}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => {
      const row = params.row;
      if (row.author) {
        return row.author.username;
      } else if (row.authorUserId) {
        return `User #${row.authorUserId}`;
      } else {
        return "Unknown";
      }
    },
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => {
      const row = params.row;
      if (row.assignee) {
        return row.assignee.username;
      } else if (row.assignedUserId) {
        return `User #${row.assignedUserId}`;
      } else {
        return "Unassigned";
      }
    },
  },
];

function TableView({ id, setIsModalNewTaskOpen }: Props) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const {
    data: tasks, // extract the data and name it as tasks
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });

  // Debug log to check task data
  React.useEffect(() => {
    if (tasks) {
      console.log("Tasks data in TableView:", tasks);
    }
  }, [tasks]);

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
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Table"
          isSmallText
          buttonComponent={
            <button
              className="bg-blue-primary flex items-center rounded px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
        />
      </div>
      <DataGrid
        rows={tasks || []}
        columns={columns}
        //   className={dataGridClassNames}
        sx={dataGridSxStyles(isDarkMode)}
      />
    </div>
  );
}

export default TableView;
