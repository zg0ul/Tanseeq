import {
  Priority,
  Status,
  useCreateProjectMutation,
  useCreateTaskMutation,
} from "@/state/api";
import React, { useState } from "react";
import Modal from "./Modal";
import { formatISO } from "date-fns";
import { create } from "node:domain";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
};

function ModalNewTask({ isOpen, onClose, id }: Props) {
  const [createTask, { isLoading }] = useCreateTaskMutation();

  // We can use a form library but for simplicity we will store values in states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  console.log("Status", status);
  console.log("Priority", priority);
  async function handleSubmit() {
    if (!title || !authorUserId) return;
    const startDateISO = startDate
      ? formatISO(new Date(startDate), {
          representation: "complete",
        })
      : undefined;
    const dueDateISO = dueDate
      ? formatISO(new Date(dueDate), {
          representation: "complete",
        })
      : undefined;
    await createTask({
      title,
      description,
      status,
      priority,
      tags,
      startDate: startDateISO,
      dueDate: dueDateISO,
      authorUserId: parseInt(authorUserId),
      assignedUserId: parseInt(assignedUserId),
      projectId: Number(id),
    });
  }

  function isFormValid() {
    return title && authorUserId; // title and authorUserId are the only required fields
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
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
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="inputStyles"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* SELECTIONS */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className="selectStyles"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as Status)
            }
          >
            <option value="">Select Status</option>
            {Object.values(Status).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            className="selectStyles"
            value={priority}
            onChange={(e) =>
              setPriority(Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value="">Select Priority</option>
            {Object.values(Priority).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          className="inputStyles"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        {/* DATES */}
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
        <input
          type="text"
          className="inputStyles"
          placeholder="Author User ID"
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
        />
        <input
          type="text"
          className="inputStyles"
          placeholder="Assigned User ID"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        />
        {/* TODO: make sure to invalidate all the fields and exit the modal when the Task is Added */}
        <button
          type="submit"
          className={`focus-offset-2 bg-blue-primary mt-4 flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Adding..." : "Add Task"}
        </button>
      </form>
    </Modal>
  );
}

export default ModalNewTask;
