
import { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import TrainList from "./TrainList";
import { generateInitialData, generateShiftManHours } from "@/lib/data";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import { Train, Activity, ShiftType, ShiftManHours } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, MoveHorizontal } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const MaintenancePlanner = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [shiftManHours, setShiftManHours] = useState<ShiftManHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLockMode, setIsLockMode] = useState(false);

  useEffect(() => {
    // Generate initial data
    const initialData = generateInitialData();
    const initialShiftManHours = generateShiftManHours();
    setTrains(initialData);
    setShiftManHours(initialShiftManHours);
    setLoading(false);
  }, []);

  const handleActivityMove = (
    activityId: string,
    trainId: string,
    targetDay: number,
    targetShift: ShiftType
  ) => {
    setTrains((prevTrains) => {
      return prevTrains.map((train) => {
        if (train.id === trainId) {
          const updatedActivities = train.activities.map((activity) => {
            if (activity.id === activityId) {
              // Check if activity is locked and not in lock mode
              if (activity.isLocked && !isLockMode) {
                toast.error("This activity is locked and cannot be moved");
                return activity;
              }

              const isOptimalDay = 
                activity.optimalDay === targetDay && 
                activity.optimalShift === targetShift;
              
              return {
                ...activity,
                day: targetDay,
                shift: targetShift,
                isOutOfOptimalTime: !isOptimalDay,
              };
            }
            return activity;
          });

          return {
            ...train,
            activities: updatedActivities,
          };
        }
        return train;
      });
    });

    // Calculate total man-hours after moving
    const targetTrain = trains.find(t => t.id === trainId);
    if (targetTrain) {
      const activity = targetTrain.activities.find(a => a.id === activityId);
      if (activity) {
        // Check if this would cause overallocation
        const shiftData = shiftManHours.find(s => s.day === targetDay && s.shift === targetShift);
        if (shiftData) {
          // Calculate current man-hours for the target shift
          const currentManHours = trains.flatMap(t => t.activities)
            .filter(a => a.day === targetDay && a.shift === targetShift && a.id !== activityId)
            .reduce((sum, a) => sum + a.manHours, 0);
          
          // Add the moved activity's man-hours
          const totalPlannedHours = currentManHours + activity.manHours;
          
          if (totalPlannedHours > shiftData.availableManHours) {
            toast.warning(`Activity moved but causes resource overallocation! (${totalPlannedHours}/${shiftData.availableManHours} hours)`);
          } else {
            toast.success("Maintenance activity rescheduled");
          }
        }
      }
    }
  };

  const handleToggleLock = (activityId: string, trainId: string, locked: boolean) => {
    setTrains((prevTrains) => {
      return prevTrains.map((train) => {
        if (train.id === trainId) {
          const updatedActivities = train.activities.map((activity) => {
            if (activity.id === activityId) {
              return {
                ...activity,
                isLocked: locked,
              };
            }
            return activity;
          });

          return {
            ...train,
            activities: updatedActivities,
          };
        }
        return train;
      });
    });

    toast.success(`Activity ${locked ? 'locked' : 'unlocked'}`);
  };

  const toggleLockMode = () => {
    setIsLockMode(prev => !prev);
    toast.info(`Switched to ${!isLockMode ? 'lock' : 'planning'} mode`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cn(
        "container mx-auto px-4 py-6 max-w-full transition-colors duration-300",
        isLockMode && "bg-gray-50"
      )}>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Train Maintenance Planner</h1>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
              <MoveHorizontal size={18} className={cn("text-gray-600", !isLockMode && "text-blue-600")} />
              <Switch 
                checked={isLockMode}
                onCheckedChange={toggleLockMode}
              />
              <Lock size={18} className={cn("text-gray-600", isLockMode && "text-amber-600")} />
              <span className="text-sm font-medium ml-1">
                {isLockMode ? "Lock Mode" : "Planning Mode"}
              </span>
            </div>
          </div>
          <p className="text-gray-600">
            Schedule maintenance activities for your fleet of 10 trains over the next 2 weeks
          </p>
        </div>

        <div className={cn(
          "bg-white rounded-lg shadow-md overflow-hidden",
          isLockMode && "bg-gray-100"
        )}>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="min-w-[1800px]">
              <CalendarHeader 
                shiftManHours={shiftManHours}
                trains={trains} 
              />
              <TrainList 
                trains={trains} 
                shiftManHours={shiftManHours}
                isLockMode={isLockMode}
                onActivityMove={handleActivityMove}
                onToggleLock={handleToggleLock}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </DndProvider>
  );
};

export default MaintenancePlanner;
