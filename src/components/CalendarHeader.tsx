
import { format, addDays } from "date-fns";
import { ShiftManHours } from "@/lib/types";

interface CalendarHeaderProps {
  shiftManHours: ShiftManHours[];
}

const CalendarHeader = ({ shiftManHours }: CalendarHeaderProps) => {
  // Get today's date
  const today = new Date();
  
  // Generate array of 14 days (2 weeks)
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  // Helper function to find available man-hours for a shift
  const getAvailableManHours = (day: number, shift: string): number => {
    const shiftData = shiftManHours.find(s => s.day === day && s.shift === shift);
    return shiftData ? shiftData.availableManHours : 0;
  };

  return (
    <div className="flex border-b">
      <div className="w-48 min-w-48 p-3 font-medium text-gray-700 bg-gray-50 border-r">
        Trains
      </div>
      <div className="flex-1 grid grid-cols-14">
        {days.map((day, index) => (
          <div key={index} className="border-r last:border-r-0">
            <div className="p-2 text-center font-medium border-b bg-gray-50">
              {format(day, "EEE")}{" "}
              <span className="text-gray-700">{format(day, "dd/MM")}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-2 text-center text-sm border-r bg-blue-50">
                Day ({getAvailableManHours(index, "day")}h)
              </div>
              <div className="p-2 text-center text-sm bg-indigo-50">
                Night ({getAvailableManHours(index, "night")}h)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
