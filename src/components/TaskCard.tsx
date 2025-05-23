import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../types/tasks";
import Modal from "./Modal";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Med":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
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

const TaskCard = ({ task, onDelete,onEdit }: TaskCardProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteConfirm = () => {
    if (!task.id) return;
    onDelete(task.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 ">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onEdit(task)}
              className="text-blue-600 hover:text-green-800 cursor-pointer"
              title="Edit"
            >
              <CiEdit size={20} />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-600 hover:text-red-800 cursor-pointer"
              title="Delete"
            >
              <MdDelete size={20} />
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-1">
          {task.description || "No description provided."}
        </p>
        <div className="flex  justify-between gap-2 ">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              Created At: {new Date(task.dueDate).toLocaleDateString()}
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 border border-blue-700 text-blue-700 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            className="text-blue-500 px-4 py-0  items rounded-md underline hover:bg-blue-100 cursor-pointer"
            onClick={() => navigate(`/tasks/${task.id}`)}
          >
            Detail
          </button>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default TaskCard;
