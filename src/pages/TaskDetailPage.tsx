import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../config/firebase";
import { getTaskById } from "../features/tasks/taskService";
import type { Task } from "../types/tasks";
import Navbar from "../components/Navbar";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Done":
      return "bg-green-100 text-green-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "To Do":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchTask = async () => {
      try {
        if (!id) throw new Error("Task ID is required");
        const taskData = await getTaskById(user.uid, id);
        if (taskData.userId !== user.uid) throw new Error("Unauthorized");
        setTask(taskData);
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg">{error || "Task not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Navbar></Navbar>
        {/* Header */}
        <div className="flex justify-between items-center bg-white rounded-xl shadow-md px-6 py-4">
          <h1
            className="text-2xl font-semibold text-gray-900 truncate max-w-xs sm:max-w-md md:max-w-full"
            title={task.title}
          >
            {task.title}
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tasks")}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md px-6 py-6 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-lg font-medium text-gray-800">Description</h2>
            <p className="mt-2 text-gray-600 line-clamp-8 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-500 uppercase">Due Date</h3>
              <p className="mt-1 text-gray-700">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 uppercase">Created At</h3>
              <p className="mt-1 text-gray-700">
                {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 uppercase">Priority</h3>
              <span
                className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 uppercase">Status</h3>
              <span
                className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
