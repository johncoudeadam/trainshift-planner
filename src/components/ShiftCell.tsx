
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
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "activity",
    drop: (item: { id: string; trainId: string }) => {
      onActivityMove(item.id, item.trainId, day, shift);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Calculate total planned man-hours for this cell
  const plannedManHours = activities.reduce((total, activity) => {
    return total + activity.manHours;
  }, 0);

  return (
    <div
      ref={drop}
      className={cn(
        "p-2 min-h-[120px] transition-colors flex flex-col",
        shift === "day" ? "bg-blue-50 border-r" : "bg-indigo-50",
        isOver && canDrop && "bg-green-100",
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
