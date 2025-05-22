import { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";
import TaskList from "../features/tasks/TaskList";
import { deleteTask, getTasks } from "../features/tasks/taskService";
import type { Task, TaskPriority, TaskStatus } from "../types/tasks";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import TaskFormModal from "../components/TaskFormModal";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
  }>({});
  const [sortKey, setSortKey] = useState<"dueDate" | "createdAt">("dueDate");
  const navigate = useNavigate();
  const handleFilterChange = (newFilters: {
    status?: TaskStatus;
    priority?: TaskPriority;
  }) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortKey: "dueDate" | "createdAt") => {
    setSortKey(newSortKey);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    let unsubscribe: (() => void) | undefined;
    const fetchTasks = async () => {
      setLoading(true);
      unsubscribe = await getTasks(user.uid, (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoading(false);
      });
    };
    fetchTasks();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    let result = [...tasks];

    // Apply filters
    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortKey === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

    setFilteredTasks(result);
  }, [tasks, filters, sortKey]);

  const handleEditTask = (task: Task) => {
    setEditTaskId(task.id);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user?.uid) {
      console.error("User is not authenticated.");
      return;
    }
    try {
      await deleteTask(user.uid, taskId);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-8">
        <Navbar />

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
      {isModalOpen && (
        <TaskFormModal
          taskId={editTaskId ?? undefined}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default TasksPage;
