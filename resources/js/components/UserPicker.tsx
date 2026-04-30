import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
};

interface UserPickerProps {
  users: User[];
  selectedUserId?: number | null;
  onChange: (userId: number) => void;
}

export default function UserPicker({
  users,
  selectedUserId,
  onChange,
}: UserPickerProps) {
  const [active, setActive] = useState<number | null>(selectedUserId ?? null);

  const handleSelect = (userId: number) => {
    setActive(userId);
    onChange(userId);
  };

  return (
    <div className="space-y-3">
      <Label className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
        Assigned To
      </Label>

      {users.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          No users available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className={`relative cursor-pointer bg-white dark:bg-gray-700 border rounded-xl p-4 flex flex-col items-center text-center 
                transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                ${
                  active === user.id
                    ? "ring-2 ring-blue-500 shadow-md scale-105 border-blue-400"
                    : "border-gray-200 dark:border-gray-600"
                }`}
            >
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={`/storage/${user.avatar}`}
                  alt={user.name}
                  className="w-14 h-14 rounded-full mb-2 object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-14 h-14 rounded-full mb-2 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                  {user.name.charAt(0)}
                </div>
              )}

              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {user.role || "Member"}
              </p>

              {active === user.id && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow">
                  <Check size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
