
import { Train, Activity, ShiftType, ShiftManHours } from "./types";

// Function to generate a random activity name
const getActivityName = (type: number): string => {
  const activityTypes = [
    "Brake Inspection",
    "Engine Maintenance",
    "Door System Check",
    "HVAC Service",
    "Electrical Systems",
    "Wheel Inspection",
    "Safety Systems Test",
    "Undercarriage Check",
    "Interior Cleaning",
    "Communication System"
  ];
  
  return activityTypes[type % activityTypes.length];
};

// Generate man-hours for all shifts
export const generateShiftManHours = (): ShiftManHours[] => {
  const shifts: ShiftManHours[] = [];
  
  // Generate for 14 days
  for (let day = 0; day < 14; day++) {
    // Day shift
    shifts.push({
      day,
      shift: "day",
      availableManHours: Math.floor(Math.random() * 20) + 20, // 20-40 man-hours
    });
    
    // Night shift
    shifts.push({
      day,
      shift: "night",
      availableManHours: Math.floor(Math.random() * 15) + 15, // 15-30 man-hours
    });
  }
  
  return shifts;
};

// Generate initial data
export const generateInitialData = (): Train[] => {
  // Create 10 trains
  return Array.from({ length: 10 }, (_, trainIndex) => {
    // Generate a unique ID for the train
    const trainId = `train-${trainIndex + 1}`;
    
    // Generate 10 activities for each train with optimal days
    const activities: Activity[] = Array.from({ length: 10 }, (_, activityIndex) => {
      // Randomly assign an optimal day and shift
      const optimalDay = Math.floor(Math.random() * 14); // 0-13 for 14 days
      const optimalShift: ShiftType = Math.random() > 0.5 ? "day" : "night";
      
      return {
        id: `activity-${trainId}-${activityIndex + 1}`,
        name: getActivityName(activityIndex),
        type: activityIndex,
        day: optimalDay,
        shift: optimalShift,
        optimalDay,
        optimalShift,
        isOutOfOptimalTime: false,
        manHours: Math.floor(Math.random() * 8) + 2, // 2-10 man-hours per activity
      };
    });
    
    return {
      id: trainId,
      name: `Train ${trainIndex + 1}`,
      activities,
    };
  });
};
