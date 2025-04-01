var express = require("express");
var router = express.Router();
const Habit = require("../models/Habit");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized, log in first." });
  }

  try {
    const tokenWithoutBearer = token.replace("Bearer ", "");
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified; // Almacena el usuario verificado en la solicitud
    next();
  } catch (error) {
    console.error("Token error:", error); // Imprime el error de token
    return res.status(403).json({ error: "Invalid or expired Token." });
  }
};

router.get("/habits", authenticateToken, async (req, res) => {
  try {
    let userId = req.user.id;
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized, log in first to get habits." });
    }
    userId = new mongoose.Types.ObjectId(userId);
    const habits = await Habit.find({ userId });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: "server error." });
  }
});

router.post("/habits", authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    let userId = req.user.id;
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized, log in first to add habits." });
    }
    userId = new mongoose.Types.ObjectId(userId);
    if (!title || !description)
      return res.status(400).json({ error: "Error creating habit" });

    const habit = new Habit({ title, description, userId });
    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

router.delete("/habits/:id", authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) res.status(404).json({ error: "Habit not found." });
    res.json({ message: "Habit deleted." });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

router.patch("/habits/markasdone/:id/", authenticateToken, async (req, res) => {
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
