"use client";

import React, { useState } from "react";
import ProjectHeader from "../ProjectHeader";
import { useParams } from "next/navigation";


function Page() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div>
      {/* MODAL NEW TASK */}
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default Page;
