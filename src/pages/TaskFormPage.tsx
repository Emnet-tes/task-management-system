// src/features/tasks/TaskFormPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskForm from "../features/tasks/TaskForm";
import { getTaskById, createTask, updateTask } from "../features/tasks/taskService";
import type { TaskInput } from "../types/tasks";
import { auth } from "../config/firebase";

const TaskFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [task, setTask] = useState<TaskInput | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (id) {
      const fetchTask = async () => {
        try {
          const taskData = await getTaskById(id);
          // Verify the task belongs to the current user
          if (taskData.userId !== user.uid) {
            navigate("/dashboard");
            return;
          }
          setTask(taskData);
        } catch (err) {
          setError("Failed to load task");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    } else {
      setLoading(false);
    }
  }, [id, user, navigate]);

  const handleSubmit = async (taskInput: TaskInput) => {
    if (!user) return;

    try {
      if (id) {
        await updateTask(id, taskInput);
      } else {
        await createTask(taskInput, user.uid);
      }
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to save task");
      console.error("Error saving task:", error);
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading task details...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {id ? "Edit Task" : "Create New Task"}
          </h2>
          <TaskForm
            onSubmit={handleSubmit}
            existingTask={task}
            onCancel={() => navigate("/dashboard")}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskFormPage;
