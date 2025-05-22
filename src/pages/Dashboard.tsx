import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { getTasks } from "../features/tasks/taskService";
import type { Task } from "../types/tasks";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import HorizontalBarChart from "../components/HorizontalBarChart";
import Navbar from "../components/Navbar";
import TaskSectionCard from "../components/TaskSectionCard";
import StatusCard from "../components/StatusCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [value, setValue] = useState<Date | Date[] | null>(new Date());
  const [userId, setUserId] = useState<string | null>(null);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const selectedDateStr =
    value instanceof Date ? value.toISOString().split("T")[0] : todayStr;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    const unsubscribeTasks = getTasks(userId, setTasks);
    return () => unsubscribeTasks();
  }, [userId]);

  const todaysTasks = tasks.filter((t) => t.dueDate === todayStr);
  const overdueTasks = tasks.filter(
    (t) => new Date(t.dueDate) < today && t.status !== "Done"
  );
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

  const statusCounts = {
    "To Do": tasks.filter((t) => t.status === "To Do").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Done: tasks.filter((t) => t.status === "Done").length,
  };

  const priorityCounts = {
    High: tasks.filter((t) => t.priority === "High").length,
    Med: tasks.filter((t) => t.priority === "Med").length,
    Low: tasks.filter((t) => t.priority === "Low").length,
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Navbar />

        {/* Top Section */}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusCard
            title="To Do"
            count={statusCounts["To Do"]}
            color="blue"
          />
          <StatusCard
            title="In Progress"
            count={statusCounts["In Progress"]}
            color="yellow"
          />
          <StatusCard title="Done" count={statusCounts["Done"]} color="green" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskSectionCard sectionTitle="Today's Tasks" tasks={todaysTasks} />
          <TaskSectionCard
            sectionTitle="Overdue Tasks"
            tasks={overdueTasks}
            overdue
          />
          <div className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center">
            <h2 className="text-lg font-medium mb-2">📅 Pick a Date</h2>
            <Calendar className="rounded-xl border-none shadow" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Tasks by Priority</h2>
            <HorizontalBarChart data={priorityCounts} />
          </div>

          {/* Tasks for Picked Date */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Tasks for {selectedDateStr}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {selectedDayTasks.length > 0 ? (
                selectedDayTasks.map((task, index) => (
                  <li key={index}>{task.title}</li>
                ))
              ) : (
                <p className="text-gray-400">No tasks for this date</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

