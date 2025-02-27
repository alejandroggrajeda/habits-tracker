var express = require("express");
var router = express.Router();
const Habit = require("../models/Habit");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

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
    const habit = new Habit({title, description});
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(400).json({ error: "error del servidor" });
  }
});

router.put('/habits/:id', async(req, res) => {
  try{
    const {title, description} = req.body;
    const newHabit = {title, description};
    const habit = await Habit.findByIdAndUpdate
    (req.params.id, {title, description}, {new: true});
    res.json({message: 'el Hábito fue actualizado exitósamente.', habit});
  }catch(error){  
    res.status(500).json({error: 'Habit not found.'})
  }
}
);

router.delete('/habits/:id', async(req, res) => {
  try{
    await Habit.findByIdAndDelete(req.params.id);
    res.json({message: 'Habit deleted.'})
  }catch(error){
    res.status(500).json({error: 'Habit not found.'})
  }
});

module.exports = router;
