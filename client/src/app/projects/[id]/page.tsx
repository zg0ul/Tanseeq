"use client";

import React, { useState } from "react";
import ProjectHeader from "../ProjectHeader";
import { useParams } from "next/navigation";
import BoardView from "@/components/projects/BoardView";
import ListView from "@/components/projects/ListView";
import TimeLineView from "@/components/projects/TimeLineView";
import TableView from "@/components/projects/TableView";
import ModalNewTask from "@/components/ModalNewTask";

function Page() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div>
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Board" && (
        <BoardView
          id={id?.toString() || ""}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
        />
      )}
      {activeTab === "List" && (
        <ListView
          id={id?.toString() || ""}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
        />
      )}
      {activeTab === "Timeline" && (
        <TimeLineView
          id={id?.toString() || ""}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
        />
      )}
      {activeTab === "Table" && (
        <TableView
          id={id?.toString() || ""}
          setIsModalNewTaskOpen={setIsModalNewTaskOpen}
        />
      )}
    </div>
  );
}

export default Page;
