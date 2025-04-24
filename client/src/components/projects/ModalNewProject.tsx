import { useCreateProjectMutation } from "@/state/api";
import React, { useState } from "react";
import Modal from "../Modal";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function ModalNewProject({ isOpen, onClose }: Props) {
  const [createProject, { isLoading }] = useCreateProjectMutation();

  // We can use a form library but for simplicity we will store values in states
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  async function handleSubmit() {
    if (!projectName || !description || !startDate || !dueDate) return;
    const startDateISO = formatISO(new Date(startDate), { representation: "complete" });
    const dueDateISO = formatISO(new Date(dueDate), { representation: "complete" });
    await createProject({
      name: projectName,
      description,
      startDate: startDateISO,
      endDate: dueDateISO,
    });
  }

  function isFormValid() {
    return projectName && description && startDate && dueDate;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className="inputStyles"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          className="inputStyles"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className="inputStyles"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="inputStyles"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        {/* TODO: make sure to invalidate all the fields and exit the modal when the project is created */}
        <button
          type="submit"
          className={`focus-offset-2 bg-blue-primary mt-4 flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
}

export default ModalNewProject;
