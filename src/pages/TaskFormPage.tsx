import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  const [user, setUser] = useState(auth.currentUser);
  const [task, setTask] = useState<TaskInput | null>(null);
  const [loading, setLoading] = useState(true); // Initial loading until auth is known

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
          console.log("Error fetching task:", err);
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
      navigate("/tasks");
    } catch (error) {
      toast.error("Failed to save task");
      console.error("Error saving task:", error);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Navbar/>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {id ? "Edit Task" : "Create New Task"}
          </h2>
          <TaskForm
            onSubmit={handleSubmit}
            existingTask={task}
            onCancel={() => navigate("/tasks")}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskFormPage;
