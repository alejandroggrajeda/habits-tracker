import { useSelector, useDispatch } from "react-redux";
import {
  markAsDoneThunk,
  fetchAddHabitThunk,
  fetchHabitsThunk,
} from "@/features/habit/habitSlice";
import { RootState, AppDispatch } from "../Redux/store";
import { useState } from "react";

type Habit = {
  _id: string;
  title: string;
  description: string;
  createdAt: Date;
  days: number;
  lastDone: Date | string;
  lastUpdate: Date;
};

type HabitsProps = {
  habits: Habit[];
};

const handleMarkAsDone = (
  habitId: string,
  dispatch: AppDispatch,
  token: string
) => {
  dispatch(markAsDoneThunk({ habitId, token }));
  if(token){
    dispatch(fetchHabitsThunk(token));
  }
}

export default function Habits({ habits }: HabitsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.habits.status);
  const error = useSelector((state: RootState) => state.habits.error);
  const user = useSelector((state: RootState) => state.user.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const calculateProgress = (days: number): number => {
    return Math.min((days / 66) * 100, 100);
  };

  const handleAddHabit = () => {
    if (title && description) {
      dispatch(
        fetchAddHabitThunk({
          token: user ? user.toString() : "",
          title,
          description,
        })
      ).then(() => {
        setTitle("");
        setDescription("");
        dispatch(fetchHabitsThunk(user ? user.toString() : ""));
      });
    }
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
                onClick={() =>
                  handleMarkAsDone(
                    habit._id,
                    dispatch,
                    user ? user.toString() : ''
                  )
                }
                disabled={status[habit._id] === "loading"}
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
        {!habits.length && <li className="text-gray-200">No habits found.</li>}
      </ul>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Add New Habit</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-100"
          />
        </div>
        <button
          onClick={handleAddHabit}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add
        </button>
      </div>
    </div>
  );
}
