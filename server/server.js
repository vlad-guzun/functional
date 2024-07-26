const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const teacher = await prisma.teacher.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.json({ teacher });
  } catch (error) {
    console.error('Error registering teacher:', error);
    res.status(500).send('Error registering teacher');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: {
        email,
      },
    });

    if (teacher && await bcrypt.compare(password, teacher.password)) {
      const token = jwt.sign({ email: teacher.email, id: teacher.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

app.use(authenticateToken);

app.get('/students', async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Error fetching students');
  }
});

app.get('/subjects', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
    });
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).send('Error fetching subjects');
  }
});

app.get('/marks', async (req, res) => {
  try {
    const marks = await prisma.mark.findMany();
    res.json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).send('Error fetching marks');
  }
});

app.post('/students', async (req, res) => {
  const { name } = req.body;
  const teacherId = req.user.id;
  try {
    const student = await prisma.student.create({
      data: { name, teacherId },
    });
    res.json(student);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send('Error adding student');
  }
});

app.post('/subjects', async (req, res) => {
  const { name, studentIds } = req.body;
  try {
    const subject = await prisma.subject.create({
      data: {
        name,
        students: {
          create: studentIds.map(studentId => ({
            student: { connect: { id: studentId } },
          })),
        },
      },
    });
    res.json(subject);
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).send('Error adding subject');
  }
});

app.post('/marks', async (req, res) => {
  const { score, studentId, subjectId } = req.body;
  try {
    const existingMark = await prisma.mark.findUnique({
      where: {
        studentId_subjectId: {
          studentId: parseInt(studentId, 10),
          subjectId: parseInt(subjectId, 10),
        },
      },
    });

    if (existingMark) {
      return res.status(400).send('Mark already exists for this student and subject');
    }

    const mark = await prisma.mark.create({
      data: {
        score: parseInt(score, 10),
        studentId: parseInt(studentId, 10),
        subjectId: parseInt(subjectId, 10),
      },
    });
    res.json(mark);
  } catch (error) {
    console.error('Error adding mark:', error);
    res.status(500).send('Error adding mark');
  }
});

app.put('/marks', async (req, res) => {
  const { score, studentId, subjectId } = req.body;
  try {
    const mark = await prisma.mark.update({
      where: {
        studentId_subjectId: {
          studentId: parseInt(studentId, 10),
          subjectId: parseInt(subjectId, 10),
        },
      },
      data: {
        score: parseInt(score, 10),
      },
    });
    res.json(mark);
  } catch (error) {
    console.error('Error updating mark:', error);
    res.status(500).send('Error updating mark');
  }
});

app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const student = await prisma.student.update({
      where: { id: parseInt(id, 10) },
      data: { name },
    });
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).send('Error updating student');
  }
});

app.put('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  const { name, studentIds } = req.body;
  try {
    const subject = await prisma.subject.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        students: {
          deleteMany: {},
          create: studentIds.map(studentId => ({
            student: { connect: { id: studentId } },
          })),
        },
      },
    });
    res.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).send('Error updating subject');
  }
});

app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.mark.deleteMany({
      where: { studentId: parseInt(id, 10) },
    });

    await prisma.subjectStudent.deleteMany({
      where: { studentId: parseInt(id, 10) },
    });

    await prisma.student.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send('Error deleting student');
  }
});

app.delete('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.mark.deleteMany({
      where: { subjectId: parseInt(id, 10) },
    });

    await prisma.subjectStudent.deleteMany({
      where: { subjectId: parseInt(id, 10) },
    });

    await prisma.subject.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).send('Error deleting subject');
  }
});

app.delete('/marks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.mark.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: 'Mark deleted successfully' });
  } catch (error) {
    console.error('Error deleting mark:', error);
    res.status(500).send('Error deleting mark');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
