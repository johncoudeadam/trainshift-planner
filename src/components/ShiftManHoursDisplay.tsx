
import { ShiftType } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ShiftManHoursDisplayProps {
  day: number;
  shift: ShiftType;
  availableManHours: number;
  plannedManHours: number;
  showAvailable?: boolean;
}

const ShiftManHoursDisplay = ({
  day,
  shift,
  availableManHours,
  plannedManHours,
  showAvailable = false,
}: ShiftManHoursDisplayProps) => {
  const isOverAllocated = plannedManHours > availableManHours;

  return (
    <div className="text-xs p-1">
      <div className="flex justify-between items-center">
        <span className={isOverAllocated ? "text-red-600 font-bold" : "text-gray-700"}>
          {showAvailable ? `${plannedManHours}h / ${availableManHours}h` : `${plannedManHours}h`}
        </span>
      </div>
    </div>
  );
};

export default ShiftManHoursDisplay;
