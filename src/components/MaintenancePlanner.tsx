
import { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import TrainList from "./TrainList";
import { generateInitialData, generateShiftManHours } from "@/lib/data";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import { Train, Activity, ShiftType, ShiftManHours } from "@/lib/types";
import { cn } from "@/lib/utils";

const MaintenancePlanner = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [shiftManHours, setShiftManHours] = useState<ShiftManHours[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-6 max-w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Train Maintenance Planner</h1>
          <p className="text-gray-600">
            Schedule maintenance activities for your fleet of 10 trains over the next 2 weeks
          </p>
        </div>

        <div className={cn("bg-white rounded-lg shadow-md overflow-hidden")}>
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              <CalendarHeader shiftManHours={shiftManHours} />
              <TrainList 
                trains={trains} 
                shiftManHours={shiftManHours}
                onActivityMove={handleActivityMove} 
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MaintenancePlanner;
