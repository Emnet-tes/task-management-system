import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TaskForm from "../features/tasks/TaskForm";
import {
  getTaskById,
  createTask,
  updateTask,
} from "../features/tasks/taskService";
import type { TaskInput } from "../types/tasks";
import { auth } from "../config/firebase";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";

const TaskFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(auth.currentUser);
  const [task, setTask] = useState<TaskInput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/");
        return;
      }

      setUser(firebaseUser);

      if (id) {
        try {
          const taskData = await getTaskById(firebaseUser.uid, id);
          if (taskData.userId !== firebaseUser.uid) {
            navigate("/tasks");
            return;
          }
          setTask(taskData);
        } catch (err) {
          toast.error("Failed to load task");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, navigate]);

  const handleSubmit = async (taskInput: TaskInput) => {
    if (!user) return;
    try {
      if (id) {
        await updateTask(user.uid, id, taskInput);
        toast.success("Task updated successfully");
      } else {
        await createTask(taskInput, user.uid);
        toast.success("Task created successfully");
      }
      navigate(-1); // go back to background route
    } catch (error) {
      toast.error("Failed to save task");
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => navigate(-1)}
        >
          ✕
        </button>
        <Navbar />
        <h2 className="text-xl font-semibold mb-4">
          {id ? "Edit Task" : "Create New Task"}
        </h2>
        <TaskForm
          onSubmit={handleSubmit}
          existingTask={task}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
};


export default TaskFormPage;
