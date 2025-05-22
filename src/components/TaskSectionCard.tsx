const TaskSectionCard = ({
  sectionTitle,
  tasks,
  overdue = false,
}: {
  sectionTitle: string;
  tasks: {
    id: string;
    title: string;
    description: string;
    priority: "High" | "Med" | "Low";
    dueDate: string;
  }[];
  overdue?: boolean;
}) => {
  const priorityColorMap = {
    High: "bg-red-200 text-red-800",
    Med: "bg-yellow-200 text-yellow-800",
    Low: "bg-green-200 text-green-800",
  };

  return (
    <div className={`p-4 rounded-xl shadow-md space-y-4 ${overdue ? "bg-red-50" : "bg-white"}`}>
      <h2 className={`text-md font-semibold ${overdue ? "text-red-700" : ""}`}>
        {sectionTitle}
      </h2>

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <div className="flex flex-col w-full">
              <p className="font-semibold text-sm">{task.title}</p>
              <p className="text-xs text-gray-600">{task.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${priorityColorMap[task.priority]}`}
                >
                  {task.priority}
                </span>
                <span className="text-xs text-red-500 font-medium">
                  Due {task.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">No tasks</p>
      )}
    </div>
  );
};

export default TaskSectionCard;
