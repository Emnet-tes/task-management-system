type PriorityData = {
  [key: string]: number;
};

const priorityColors: { [key: string]: string } = {
  Urgent: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-yellow-400",
  Low: "bg-blue-500",
};

const HorizontalBarChart = ({ data }: { data: PriorityData }) => {
  const maxValue = Math.max(...Object.values(data), 1); // Avoid division by zero

  return (
    <div className="space-y-3">
      {Object.entries(data).map(([priority, count]) => (
        <div key={priority}>
          <div className="flex justify-between text-sm mb-1">
            <span className="capitalize">{priority}</span>
            <span className="text-gray-400">{count}</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded">
            <div
              className={`h-2 rounded ${priorityColors[priority] || "bg-gray-500"}`}
              style={{ width: `${(count / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HorizontalBarChart;
