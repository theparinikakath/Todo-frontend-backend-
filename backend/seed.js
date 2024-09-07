const mongoose = require('mongoose');

// Replace with your MongoDB URI
const uri = 'mongodb://localhost:27017/todolist';

mongoose.connect(uri, {
})
.then(() => {
    console.log('MongoDB connected');

    const Task = mongoose.model('Task', new mongoose.Schema({
        task: String,
        isDone: Boolean
    }));

    return Task.insertMany([
        { task: 'Eat', isDone: false },
        { task: 'Code', isDone: false }
    ]);
})
.then(() => {
    console.log('Tasks inserted');
    return mongoose.disconnect();
})
.catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
});
