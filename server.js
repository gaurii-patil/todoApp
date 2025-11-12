const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todoApp';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Task model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes (EJS rendered)
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render('index', { tasks });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) return res.redirect('/');
    const task = new Task({ title: title.trim() });
    await task.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/tasks/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.redirect('/');
    task.completed = !task.completed;
    await task.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/tasks/:id/delete', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Keep API endpoints for compatibility
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});