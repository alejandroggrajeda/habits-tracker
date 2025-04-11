export const fetchHabits = async (token: string) => {
  const response = await fetch("https://habits-tracker-backend-gilt.vercel.app/habits", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch habits");
  }
  return response;
};

export const fetchAddHabit = async (
  token: string,
  title: string,
  description: string
) => {
  const response = await fetch("https://habits-tracker-backend-gilt.vercel.app/habits", {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: 'Bearer ' + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "title": title, "description": description }),
  });
  if (!response.ok) {
    throw new Error("Failed to add habit");
  }
  return response;
};
