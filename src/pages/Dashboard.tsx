import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { getTasks, deleteTask } from "../features/tasks/taskService";
import type { Task } from "../types/tasks";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import FilterBar from "../components/FilterBar";
import HorizontalBarChart from "../components/HorizontalBarChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [value, setValue] = useState<Date | Date[] | null>(new Date());
  const [userId, setUserId] = useState<string | null>(null);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Ensure we get the authenticated user correctly
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/signin");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // Fetch tasks only after userId is available
  useEffect(() => {
    if (!userId) return;
    const unsubscribeTasks = getTasks(userId, setTasks);
    return () => unsubscribeTasks();
  }, [userId]);

  const todaysTasks = tasks.filter((t) => t.dueDate === todayStr);
  const overdueTasks = tasks.filter(
    (t) => new Date(t.dueDate) < today && t.status !== "Done"
  );

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-8">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
            onClick={async () => {
              await signOut(auth);
              navigate("/");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
            >
            Logout
            </button>
        </div>

        {/* Row 1: Today, Overdue, Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DashboardBox
            title="Today's Tasks"
            items={todaysTasks.map((t) => t.title)}
          />
          <DashboardBox
            title="Overdue Tasks"
            items={overdueTasks.map((t) => t.title)}
            highlight
          />
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-medium mb-2 text-center">📅 Calendar</h2>
            <Calendar />
          </div>
        </div>

        {/* Row 2: Task Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

        {/* Row 3: Priority Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Tasks by Priority</h2>
          <HorizontalBarChart data={priorityCounts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// DashboardBox component
const DashboardBox = ({
  title,
  items,
  highlight = false,
}: {
  title: string;
  items: string[];
  highlight?: boolean;
}) => (
  <div
    className={`p-4 rounded-xl shadow ${highlight ? "bg-red-100" : "bg-white"}`}
  >
    <h2 className="text-md font-semibold mb-2">{title}</h2>
    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
      {items.length > 0 ? (
        items.map((item, i) => <li key={i}>{item}</li>)
      ) : (
        <p className="text-gray-400">No tasks</p>
      )}
    </ul>
  </div>
);

// StatusCard component
const StatusCard = ({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: string;
}) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
  };
  return (
    <div
      className={`p-5 rounded-xl shadow ${
        colorMap[color as keyof typeof colorMap]
      }`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
};
