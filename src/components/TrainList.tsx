
import { Train, Activity, ShiftType, ShiftManHours } from "@/lib/types";
import ActivityItem from "./ActivityItem";
import ShiftCell from "./ShiftCell";
import { TrainFront } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TrainListProps {
  trains: Train[];
  shiftManHours: ShiftManHours[];
  onActivityMove: (
    activityId: string,
    trainId: string, 
    targetDay: number,
    targetShift: ShiftType
  ) => void;
}

const TrainList = ({ trains, shiftManHours, onActivityMove }: TrainListProps) => {
  // Generate day numbers (0-13) for 2 weeks
  const days = Array.from({ length: 14 }, (_, i) => i);
  
  // Helper function to find available man-hours for a shift
  const getAvailableManHours = (day: number, shift: ShiftType): number => {
    const shiftData = shiftManHours.find(s => s.day === day && s.shift === shift);
    return shiftData ? shiftData.availableManHours : 0;
  };

  // Helper function to get activities for a specific cell
  const getActivitiesForCell = (train: Train, day: number, shift: ShiftType): Activity[] => {
    return train.activities.filter(
      (activity) => activity.day === day && activity.shift === shift
    );
  };

  // Helper function to calculate total planned man-hours for a day and shift across all trains
  const getTotalPlannedHours = (day: number, shift: ShiftType): number => {
    return trains.flatMap(train => train.activities)
      .filter(activity => activity.day === day && activity.shift === shift)
      .reduce((sum, activity) => sum + activity.manHours, 0);
  };

  // Check if a shift is overallocated
  const isShiftOverallocated = (day: number, shift: ShiftType): boolean => {
    const totalPlanned = getTotalPlannedHours(day, shift);
    const available = getAvailableManHours(day, shift);
    return totalPlanned > available;
  };

  return (
    <div>
      {trains.map((train) => (
        <div key={train.id} className="flex border-b last:border-b-0">
          <div className="w-48 min-w-48 p-3 font-medium flex items-center gap-2 bg-gray-50 border-r">
            <TrainFront className="text-blue-600" size={18} />
            <span>{train.name}</span>
          </div>
          <div className="flex-1 grid grid-cols-14">
            {days.map((day) => (
              <div key={day} className="border-r last:border-r-0 grid grid-cols-1">
                <div className="grid grid-cols-2 h-full">
                  {/* Day Shift Cell */}
                  <ShiftCell
                    trainId={train.id}
                    day={day}
                    shift="day"
                    activities={getActivitiesForCell(train, day, "day")}
                    availableManHours={getAvailableManHours(day, "day")}
                    onActivityMove={onActivityMove}
                  >
                    {/* Show overallocation alert for the first train in the column only */}
                    {train.id === trains[0].id && isShiftOverallocated(day, "day") && (
                      <Alert variant="destructive" className="mb-2 p-2">
                        <AlertCircle className="h-3 w-3" />
                        <AlertTitle className="text-xs">Column Overallocation!</AlertTitle>
                        <AlertDescription className="text-xs">
                          Total: {getTotalPlannedHours(day, "day")}h / {getAvailableManHours(day, "day")}h
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {getActivitiesForCell(train, day, "day").map((activity) => (
                      <ActivityItem 
                        key={activity.id} 
                        activity={activity} 
                        trainId={train.id} 
                      />
                    ))}
                  </ShiftCell>
                  
                  {/* Night Shift Cell */}
                  <ShiftCell
                    trainId={train.id}
                    day={day}
                    shift="night"
                    activities={getActivitiesForCell(train, day, "night")}
                    availableManHours={getAvailableManHours(day, "night")}
                    onActivityMove={onActivityMove}
                  >
                    {/* Show overallocation alert for the first train in the column only */}
                    {train.id === trains[0].id && isShiftOverallocated(day, "night") && (
                      <Alert variant="destructive" className="mb-2 p-2">
                        <AlertCircle className="h-3 w-3" />
                        <AlertTitle className="text-xs">Column Overallocation!</AlertTitle>
                        <AlertDescription className="text-xs">
                          Total: {getTotalPlannedHours(day, "night")}h / {getAvailableManHours(day, "night")}h
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {getActivitiesForCell(train, day, "night").map((activity) => (
                      <ActivityItem 
                        key={activity.id} 
                        activity={activity} 
                        trainId={train.id} 
                      />
                    ))}
                  </ShiftCell>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainList;
