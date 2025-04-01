
import { ReactNode } from "react";
import { useDrop } from "react-dnd";
import { ShiftType, Activity } from "@/lib/types";
import { cn } from "@/lib/utils";
import ShiftManHoursDisplay from "./ShiftManHoursDisplay";

interface ShiftCellProps {
  children: ReactNode;
  trainId: string;
  day: number;
  shift: ShiftType;
  activities: Activity[];
  availableManHours: number;
  onActivityMove: (
    activityId: string,
    trainId: string,
    targetDay: number,
    targetShift: ShiftType
  ) => void;
}

const ShiftCell = ({ 
  children, 
  trainId, 
  day, 
  shift, 
  activities, 
  availableManHours,
  onActivityMove 
}: ShiftCellProps) => {
  const [{ isOver, canDrop, item }, drop] = useDrop({
    accept: "activity",
    drop: (item: { id: string; trainId: string; optimalDay: number; optimalShift: ShiftType }) => {
      onActivityMove(item.id, item.trainId, day, shift);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      item: monitor.getItem() as { 
        id: string; 
        trainId: string; 
        optimalDay: number; 
        optimalShift: ShiftType 
      } | null,
    }),
  });

  // Calculate total planned man-hours for this cell
  const plannedManHours = activities.reduce((total, activity) => {
    return total + activity.manHours;
  }, 0);

  // Only highlight cells in the same train as the dragged item
  const isSameTrain = item && item.trainId === trainId;
  
  // Determine highlight color based on proximity to optimal day
  const getProximityHighlight = () => {
    if (!item || !isSameTrain) return "";
    
    const dayDifference = Math.abs(day - item.optimalDay);
    
    // Color gradient based on proximity (0-2 days)
    if (dayDifference === 0 && shift === item.optimalShift) return "bg-green-200/80"; // Exact match
    else if (dayDifference === 0) return "bg-green-100/70"; // Same day, different shift
    else if (dayDifference === 1) return "bg-green-100/50"; // 1 day difference
    else if (dayDifference === 2) return "bg-green-50/40"; // 2 days difference
    return "";
  };

  return (
    <div
      ref={drop}
      className={cn(
        "p-2 min-h-[120px] transition-colors flex flex-col",
        shift === "day" ? "bg-blue-50 border-r" : "bg-indigo-50",
        isOver && canDrop && "bg-green-300",
        getProximityHighlight(),
        plannedManHours > availableManHours ? "border-red-500 border-2" : ""
      )}
    >
      <ShiftManHoursDisplay
        day={day}
        shift={shift}
        availableManHours={availableManHours}
        plannedManHours={plannedManHours}
        showAvailable={false}
      />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ShiftCell;
