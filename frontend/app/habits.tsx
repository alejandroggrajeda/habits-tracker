import { useSelector, useDispatch } from "react-redux";
import { markAsDoneThunk } from "@/features/habit/habitSlice";
import { RootState, AppDispatch } from "../Redux/store";
import { fetchHabitsThunk } from "@/features/habit/habitSlice";

type Habit = {
  _id: string;
  title: string;
  description: string;
  createdAt: Date;
  days: number;
  lastDone: Date;
  lastUpdate: Date;
};

type HabitsProps = {
  habits: Habit[];
};

const handleMarkAsDone = (dispatch: AppDispatch, habitId: string) => {
  dispatch(markAsDoneThunk(habitId));
  dispatch(fetchHabitsThunk());
};

export default function Habits({ habits }: HabitsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.habits.status);
  const error = useSelector((state: RootState) => state.habits.error);

  const calculateProgress = (days: number): number => {
    return Math.min((days / 66) * 100, 100);
  };
  return (
    <div className="w-full max-w-fit p-4 bg-slate-700 rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-200 text-center">
        Habits Tracker
      </h1>

      <ul className="space-y-4">
        {habits.map((habit: Habit) => (
          <li className="flex items-center justify-between" key={habit._id}>
            <span className="text-gray-200">{habit.title}</span>
            <div className="flex items-center space-x-2">
              <progress
                className="w-24"
                value={calculateProgress(habit.days)}
                max={100}
              ></progress>
              <button
                className="px-2 py-1 text-sm text-gray-200 bg-blue-500 rounded"
                onClick={() => handleMarkAsDone(dispatch, habit._id)}
              >
                {status[habit._id] === "loading"
                  ? "Loading..."
                  : "Mark as done"}
              </button>
              {status[habit._id] === "failed" && (
                <span className="text-red-500">{error[habit._id]}</span>
              )}
              {status[habit._id] === "succeeded" && (
                <span className="text-green-500">
                  Habit marked as done. Current streak: {habit.days} days.
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
