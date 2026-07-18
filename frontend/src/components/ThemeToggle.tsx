import { Sun, Moon, Laptop } from "lucide-react";
import { ThemePreference } from "../types";

interface ThemeToggleProps {
  current: ThemePreference;
  onChange: (theme: ThemePreference) => void;
}

export default function ThemeToggle({ current, onChange }: ThemeToggleProps) {
  const options: { value: ThemePreference; icon: any; label: string }[] = [
    { value: "light", icon: Sun, label: "Claro" },
    { value: "dark", icon: Moon, label: "Escuro" },
    { value: "system", icon: Laptop, label: "Auto" }
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg border border-gray-200 dark:border-zinc-700">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = current === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            title={opt.label}
            className={`flex items-center justify-center p-1.5 rounded-md transition-all duration-200 ${
              isActive
                ? "bg-white dark:bg-zinc-700 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-zinc-100"
            }`}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
