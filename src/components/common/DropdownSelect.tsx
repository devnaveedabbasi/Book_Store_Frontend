import React, { useState, useEffect } from "react";
import { baseUrlImg } from "../../features/slicer/Slicer";

type DropdownOption = {
  _id?: string; // MongoDB
  id?: string; // Custom/manual
  name: string;
  icon?: string;
};

interface SelectDropdownProps {
  data: DropdownOption[];
  selectedId?: string;
  label?: string;
  icon?: boolean;
  onChange?: (id: string) => void;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  data = [],
  selectedId,
  label = "Select an option",
  icon = false,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const getId = (item: DropdownOption) => item._id || item.id;

  // Always sync selectedId from parent
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    selectedId
  );
  useEffect(() => {
    setSelectedValue(selectedId);
  }, [selectedId]);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string) => {
    setSelectedValue(id);
    setOpen(false);
    onChange?.(id);
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className="border rounded-lg px-4 py-2 bg-white cursor-pointer flex items-center justify-between"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>
          {selectedValue
            ? data.find((item) => getId(item) === selectedValue)?.name || label
            : label}
        </span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <input
            type="text"
            className="w-full px-3 py-2 border-b outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {filteredData.length === 0 && (
            <div className="px-4 py-2 text-gray-400">No options</div>
          )}
          {filteredData.map((item) => {
            const id = getId(item);
            return (
              <div
                key={id}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedValue === id ? "bg-indigo-100" : ""
                }`}
                onClick={() => handleSelect(id!)}
              >
                {icon && item.icon && (
                  <img
                    src={baseUrlImg + item.icon}
                    alt="icon"
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
