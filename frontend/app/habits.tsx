import React, { useState } from "react";

type Habit = {
  _id: string;
  title: string;
  description: string;
};

type HabitsProps = {
  habits: Habit[];
};

export default function Habits({ habits }: HabitsProps) {
  return (
    <div className="w-full max-w-md p-4 bg-slate-700 rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-200 text-center">Habits Tracker</h1>

      <ul className="space-y-4">
        {habits.map((habit: Habit) => (
          <li className="flex items-center justify-between" key={habit._id}>
            <span className="text-gray-200">{habit.title}</span>
            <div className="flex items-center space-x-2">
            <progress className="w-24" value={70} max={100}></progress>
            <button className="px-2 py-1 text-sm text-gray-200 bg-blue-500 rounded" >Done</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
