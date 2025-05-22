import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../types/tasks";
import Modal from "./Modal";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Done":
      return "bg-green-100 text-green-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "To Do":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteConfirm = () => {
    if (!task.id) return;
    onDelete(task.id);
    setIsDeleteModalOpen(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on edit/delete buttons
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("svg")
    ) {
      return;
    }
    navigate(`/tasks/${task.id}`);
  };

  return (
    <>
      <div
        className="bg-white rounded-xl shadow border border-gray-200 p-5 w-full cursor-pointer hover:shadow-lg transition"
        onClick={handleCardClick}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${task.title}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              {task.title}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              {task.description || "No description provided."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="text-gray-500 hover:text-blue-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              className="text-gray-500 hover:text-red-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span
            className={`px-3 py-1 rounded-full font-medium ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
          <span
            className={`px-3 py-1 rounded-full font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
          <span className="text-gray-600">
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default TaskCard;
