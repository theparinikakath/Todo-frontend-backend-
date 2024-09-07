const mongoose = require('mongoose');
const express = require('express');
const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todolist', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.use('/tasks', require('./routes/tasks'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
db.tasks.insertMany([
    { task: "Eat", isDone: false },
    { task: "Code", isDone: false }
]);
