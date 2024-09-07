const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Adjust path if necessary
const port=5000;
const app = express();

app.use(express.json());

// Mock data
let tasks = [
    { _id: 'some-unique-id', task: 'Sample Task', isDone: false }
];

// GET endpoint to fetch tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Other endpoints...

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    try {
        const newTask = new Task({ task: req.body.task });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error adding task', error });
    }
});

module.exports = router;

// Get a task by ID
router.get('/:id', getTask, (req, res) => {
    res.json(res.task);
});

// Update a task by ID
router.patch('/:id', getTask, async (req, res) => {
    if (req.body.task != null) {
        res.task.task = req.body.task;
    }
    if (req.body.isDone != null) {
        res.task.isDone = req.body.isDone;
    }
    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task by ID
router.delete('/:id', getTask, async (req, res) => {
    try {
        await res.task.remove();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get a task by ID
async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.task = task;
    next();
}

module.exports = router;
