
import { useDrag } from "react-dnd";
import { Activity } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  activity: Activity;
  trainId: string;
}

const ActivityItem = ({ activity, trainId }: ActivityItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: "activity",
    item: { id: activity.id, trainId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Base classes for all activity items
  const baseClasses = "p-1 text-xs rounded mb-1 cursor-move transition-opacity";
  
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

  return (
    <div
      ref={drag}
      className={cn(
        baseClasses,
        getActivityColor(activity.type),
        isDragging ? "opacity-50" : "opacity-100",
        activity.isOutOfOptimalTime && "border-2 border-red-500",
        "text-white"
      )}
    >
      {activity.name}
    </div>
  );
};

export default ActivityItem;
