const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Update the connection string to include the database name
mongoose.connect('mongodb+srv://masumre1010:TLYdPzaOrIUBPZZh@cluster0.56qq7gn.mongodb.net/Alemeno', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const students = [
  { id: 1, name: 'John Doe', enrolledCourses: [101, 102] },
  { id: 2, name: 'Jane Smith', enrolledCourses: [102, 103] },
];

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phone: String,
  website: String,
  linkdin: String,
  skype: String,
  photo: String,
  userid: String,
});

const Course = mongoose.model('Course', userSchema, 'courselist');

app.use(cors());
// Define a simple route
app.get('/api/v1/courselist', async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = { name: { $regex: new RegExp(search, 'i') } };
    }

    const courses = await Course.find(query);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/courselist/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// dashboard student
app.get('/api/v1/student/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);

  const student = students.find((s) => s.id === userId);

  if (student) {
    res.json({
      userId,
      studentName: student.name,
    });
  } else {
    res.status(404).json({ error: 'Student not found.' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
