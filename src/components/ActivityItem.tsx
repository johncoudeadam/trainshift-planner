
import { useDrag } from "react-dnd";
import { Activity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Clock, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ActivityItemProps {
  activity: Activity;
  trainId: string;
  isLockMode: boolean;
  onToggleLock?: (activityId: string, trainId: string, locked: boolean) => void;
  onUpdateActivity?: (activityId: string, trainId: string, day: number, shift: Activity['shift']) => void;
}

const ActivityItem = ({ 
  activity, 
  trainId, 
  isLockMode, 
  onToggleLock,
  onUpdateActivity 
}: ActivityItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: "activity",
    item: { 
      id: activity.id, 
      trainId,
      optimalDay: activity.optimalDay,
      optimalShift: activity.optimalShift,
      manHours: activity.manHours,
      isLocked: activity.isLocked,
      originalDay: activity.day,
      originalShift: activity.shift
    },
    canDrag: () => !isLockMode && !activity.isLocked,
    end: (item, monitor) => {
      // If the activity is locked and was tried to be dragged,
      // return it to its original position
      if (activity.isLocked && onUpdateActivity && !monitor.didDrop()) {
        onUpdateActivity(activity.id, trainId, activity.day, activity.shift);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Base classes for all activity items
  const baseClasses = "p-2 text-xs rounded mb-1 transition-opacity";
  
  // Choose color based on activity type
  const getActivityColor = (activityType: number) => {
    const colors = [
      "bg-blue-500 hover:bg-blue-600",
      "bg-green-500 hover:bg-green-600",
      "bg-amber-500 hover:bg-amber-600", 
      "bg-indigo-500 hover:bg-indigo-600",
      "bg-purple-500 hover:bg-purple-600",
      "bg-rose-500 hover:bg-rose-600",
      "bg-cyan-500 hover:bg-cyan-600",
      "bg-lime-500 hover:bg-lime-600",
      "bg-pink-500 hover:bg-pink-600",
      "bg-emerald-500 hover:bg-emerald-600",
    ];
    return colors[activityType % colors.length];
  };

  const handleLockToggle = () => {
    if (onToggleLock) {
      onToggleLock(activity.id, trainId, !activity.isLocked);
    }
  };

  return (
    <div
      ref={!isLockMode ? drag : undefined}
      className={cn(
        baseClasses,
        getActivityColor(activity.type),
        isDragging ? "opacity-50" : "opacity-100",
        activity.isOutOfOptimalTime && "border-2 border-yellow-300",
        "text-white",
        isLockMode ? "cursor-default" : "cursor-move",
        activity.isLocked && !isLockMode && "ring-2 ring-yellow-500"
      )}
    >
      <div className="flex justify-between items-center">
        <span className="truncate mr-1">{activity.name}</span>
        <div className="flex items-center gap-1">
          {activity.isLocked && !isLockMode && (
            <Lock size={10} className="text-yellow-300" />
          )}
          <span className="flex items-center gap-1 whitespace-nowrap bg-black/20 px-1 rounded">
            <Clock size={10} />
            {activity.manHours}h
          </span>
          {isLockMode && (
            <Switch 
              className="scale-75 ml-1" 
              checked={activity.isLocked}
              onCheckedChange={handleLockToggle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
