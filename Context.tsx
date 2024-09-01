import React, { createContext, useState, ReactNode } from "react";

// Define the shape of the context value
interface FitnessContextType {
  completed: any[];
  setCompleted: React.Dispatch<React.SetStateAction<any[]>>;
  workout: number;
  setWorkout: React.Dispatch<React.SetStateAction<number>>;
  calories: number;
  setCalories: React.Dispatch<React.SetStateAction<number>>;
  minutes: number;
  setMinutes: React.Dispatch<React.SetStateAction<number>>;
}

// Provide a default value that matches the shape of the context value
const defaultContextValue: FitnessContextType = {
  completed: [],
  setCompleted: () => {}, // Default function for `setCompleted`
  workout: 0,
  setWorkout: () => {}, // Default function for `setWorkout`
  calories: 0,
  setCalories: () => {}, // Default function for `setCalories`
  minutes: 0,
  setMinutes: () => {}, // Default function for `setMinutes`
};

const FitnessItems = createContext<FitnessContextType>(defaultContextValue);

interface FitnessContextProps {
  children: ReactNode;
}

const FitnessContext: React.FC<FitnessContextProps> = ({ children }) => {
  const [completed, setCompleted] = useState<any[]>([]);
  const [workout, setWorkout] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  return (
    <FitnessItems.Provider
      value={{
        completed,
        setCompleted,
        workout,
        setWorkout,
        calories,
        setCalories,
        minutes,
        setMinutes,
      }}
    >
      {children}
    </FitnessItems.Provider>
  );
};

export { FitnessContext, FitnessItems };
