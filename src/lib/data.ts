
import { Train, Activity, ShiftType } from "./types";

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
      };
    });
    
    return {
      id: trainId,
      name: `Train ${trainIndex + 1}`,
      activities,
    };
  });
};
