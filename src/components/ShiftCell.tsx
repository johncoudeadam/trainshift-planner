
import { ReactNode } from "react";
import { useDrop } from "react-dnd";
import { ShiftType, Activity } from "@/lib/types";
import { cn } from "@/lib/utils";
import ShiftManHoursDisplay from "./ShiftManHoursDisplay";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { AlertTriangle } from "lucide-react";

interface ShiftCellProps {
  children: ReactNode;
  trainId: string;
  day: number;
  shift: ShiftType;
  activities: Activity[];
  availableManHours: number;
  isLockMode: boolean;
  onActivityMove: (
    activityId: string,
    trainId: string,
    targetDay: number,
    targetShift: ShiftType
  ) => void;
}

// Define the DragItem interface to include manHours
interface DragItem {
  id: string;
  trainId: string;
  optimalDay: number;
  optimalShift: ShiftType;
  manHours: number;
  isLocked?: boolean;
  originalDay?: number;
  originalShift?: ShiftType;
}

const ShiftCell = ({ 
  children, 
  trainId, 
  day, 
  shift, 
  activities, 
  availableManHours,
  isLockMode,
  onActivityMove 
}: ShiftCellProps) => {
  const [{ isOver, canDrop, item }, drop] = useDrop({
    accept: "activity",
    drop: (item: DragItem) => {
      // If the activity is locked, it should return to its original position
      if (item.isLocked) {
        if (item.originalDay !== undefined && item.originalShift !== undefined) {
          onActivityMove(item.id, item.trainId, item.originalDay, item.originalShift);
        }
      } else {
        onActivityMove(item.id, item.trainId, day, shift);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      item: monitor.getItem() as DragItem | null,
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
    if (!item || !isSameTrain || isLockMode) return "";
    
    const dayDifference = Math.abs(day - item.optimalDay);
    
    // Color gradient based on proximity (0-2 days)
    if (dayDifference === 0 && shift === item.optimalShift) return "bg-green-200/80"; // Exact match
    else if (dayDifference === 0) return "bg-green-100/70"; // Same day, different shift
    else if (dayDifference === 1) return "bg-green-100/50"; // 1 day difference
    else if (dayDifference === 2) return "bg-green-50/40"; // 2 days difference
    return "";
  };

  // Calculate if the shift would be overallocated
  const isDraggingOver = isOver && canDrop && item;
  const draggedActivityManHours = item?.id ? 
    // If the activity is from the same cell, don't count it twice
    (item.trainId === trainId && item.optimalDay === day && item.optimalShift === shift) ? 0 : 
    // Otherwise, add its manhours
    (item?.manHours || 0) : 0;
  
  const totalPlannedWithDragged = plannedManHours + draggedActivityManHours;
  const isOverallocated = totalPlannedWithDragged > availableManHours;

  // Cell content with or without tooltip
  const cellContent = (
    <div
      className={cn(
        "p-2 min-h-[120px] transition-colors flex flex-col w-full h-full",
        shift === "day" ? 
          isLockMode ? "bg-gray-100 border-r" : "bg-blue-50 border-r" : 
          isLockMode ? "bg-gray-200" : "bg-indigo-50",
        isOver && canDrop && !isLockMode && "bg-green-300",
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

  return (
    <div ref={!isLockMode ? drop : undefined} className="w-full h-full">
      {isDraggingOver && !isLockMode ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {cellContent}
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2">
            <span>
              {totalPlannedWithDragged}h / {availableManHours}h
            </span>
            {isOverallocated && (
              <AlertTriangle size={16} className="text-red-500" />
            )}
          </TooltipContent>
        </Tooltip>
      ) : (
        cellContent
      )}
    </div>
  );
};

export default ShiftCell;
