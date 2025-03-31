
import { ShiftType } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ShiftManHoursDisplayProps {
  day: number;
  shift: ShiftType;
  availableManHours: number;
  plannedManHours: number;
}

const ShiftManHoursDisplay = ({
  day,
  shift,
  availableManHours,
  plannedManHours,
}: ShiftManHoursDisplayProps) => {
  const isOverAllocated = plannedManHours > availableManHours;

  return (
    <div className="text-xs p-1">
      <div className="flex justify-between items-center">
        <span className={isOverAllocated ? "text-red-600 font-bold" : "text-gray-700"}>
          {plannedManHours}h / {availableManHours}h
        </span>
      </div>
      
      {isOverAllocated && (
        <Alert variant="destructive" className="mt-1 p-2">
          <AlertCircle className="h-3 w-3" />
          <AlertTitle className="text-xs">Resource Overallocation!</AlertTitle>
          <AlertDescription className="text-xs">
            Exceeds by {plannedManHours - availableManHours} hours
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ShiftManHoursDisplay;
