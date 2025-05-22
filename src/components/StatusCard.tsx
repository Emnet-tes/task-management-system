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
      className={`p-5 rounded-xl shadow-md flex flex-col items-center justify-center text-center ${
        colorMap[color as keyof typeof colorMap]
      }`}
    >
      <h3 className="text-md font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
};

export default StatusCard;