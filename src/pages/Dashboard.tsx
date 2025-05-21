import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import { auth } from "../config/firebase";
import TaskList from "../features/tasks/TaskList";
import { deleteTask, getTasks } from "../features/tasks/taskService";
import type { Task, TaskPriority, TaskStatus } from "../types/tasks";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
  }>({});
  const [sortKey, setSortKey] = useState<"dueDate" | "createdAt">("dueDate");
  const navigate = useNavigate();
  const user = auth.currentUser;
  console.log("Fetching tasks for user:", user);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = getTasks(user.uid, setTasks);
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    let result = [...tasks];

    // Apply filters
    if (filters.status) {
      result = result.filter(task => task.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(task => task.priority === filters.priority);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortKey === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

    setFilteredTasks(result);
  }, [tasks, filters, sortKey]);

  const handleAddTaskClick = () => {
    navigate("/tasks/add");
  };

  const handleEditTask = (task: Task) => {
    navigate(`/tasks/edit/${task.id}`);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user?.uid) {
      console.error("User is not authenticated.");
      return;
    }
    try {
      await deleteTask(user.uid , taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleFilterChange = (newFilters: {
    status?: TaskStatus;
    priority?: TaskPriority;
  }) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortKey: "dueDate" | "createdAt") => {
    setSortKey(newSortKey);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome, {user?.email}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleAddTaskClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Add Task
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <FilterBar
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />

          <div className="mt-6">
            <TaskList
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
