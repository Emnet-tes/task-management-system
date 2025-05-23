import { useState } from "react";
import type { TaskPriority, TaskStatus } from "../types/tasks";

interface FilterBarProps {
  onFilterChange: (filter: {
    status?: TaskStatus;
    priority?: TaskPriority;
  }) => void;
  onSortChange: (sortKey: "dueDate" | "createdAt") => void;
}

const FilterBar = ({ onFilterChange, onSortChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
  }>({});

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value || undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as "dueDate" | "createdAt");
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-end justify-end gap-4 w-full">
      <div className="w-full md:w-auto">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={filters.status || ""}
          onChange={handleFilterChange}
          className="w-full md:w-[200px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          {["To Do", "In Progress", "Done"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-auto">
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={filters.priority || ""}
          onChange={handleFilterChange}
          className="w-full md:w-[200px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Priorities</option>
          {["Low", "Med", "High", "urgent"].map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-auto">
        <label
          htmlFor="sort"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sort By
        </label>
        <select
          id="sort"
          onChange={handleSortChange}
          className="w-full md:w-[200px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="createdAt">Sort by Creation Date</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
