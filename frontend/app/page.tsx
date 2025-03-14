"use client";

import { use, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHabitsThunk } from "@/features/habit/habitSlice";
import { RootState, AppDispatch } from "@/Redux/store";
import Habits from "./habits";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: RootState) => state.habits.habits);
  useEffect(() => {
    dispatch(fetchHabitsThunk());
  }, [dispatch]);
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Habits habits={habits} />
    </div>
  );
}
