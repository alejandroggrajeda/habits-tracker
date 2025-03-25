var express = require("express");
var router = express.Router();
const Habit = require("../models/Habit");

router.get("/habits", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: "error del servidor." });
  }
});

router.post("/habits", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description)
      return res
        .status(400)
        .json({ error: "title and description are required." });

    const habit = new Habit({ title, description });
    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: "error del servidor" });
  }
});

router.put("/habits/:id", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description)
      return res
        .status(400)
        .json({ error: "title and description are required." });

    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!habit) return res.status(404).json({ error: "Habit not found." });

    res.json({ message: "el Hábito fue actualizado exitósamente.", habit });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

router.delete("/habits/:id", async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) res.status(404).json({ error: "Habit not found." });
    res.json({ message: "Habit deleted." });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

router.patch("/habits/markasdone/:id/", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: "Habit not found." });

    const now = new Date();
    const currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ); // Fecha actual sin hora

    // Convertir lastDone a fecha sin hora para comparación por día
    const lastDoneDay = new Date(
      habit.lastDone.getFullYear(),
      habit.lastDone.getMonth(),
      habit.lastDone.getDate()
    );

    // Calcular diferencia en días
    const diffTime = currentDate - lastDoneDay;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Ya marcado hoy, no incrementar contador
      habit.lastDone = now;
      await habit.save();
      return res
        .status(200)
        .json({ message: "Habit already marked as done today." });
    } else if (diffDays === 1) {
      // Es el día siguiente, incrementar racha
      habit.days += 1;
      habit.lastDone = now;
      habit.lastUpdate = now;
      await habit.save();
      return res.status(200).json({
        message: `Habit marked as done. Current streak: ${habit.days} days.`,
      });
    } else {
      // Han pasado más de un día, reiniciar racha
      habit.days = 1;
      habit.lastDone = now;
      habit.lastUpdate = now;
      await habit.save();
      return res
        .status(200)
        .json({ message: "Streak reset. Starting new streak." });
    }
  } catch (error) {
    console.error("Error updating habit:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
