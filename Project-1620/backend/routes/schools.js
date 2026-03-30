import express from 'express';
import School from '../models/School.js';

const router = express.Router();

// GET /api/schools - list all schools
router.get('/', async (req, res) => {
  try {
    const schools = await School.find().sort({ name: 1 });
    res.json(schools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/schools - create a new school
router.post('/', async (req, res) => {
  try {
    const { name, address, rating, district, type, studentsCount, hasPlaces } = req.body;
    const school = new School({ name, address, rating, district, type, studentsCount, hasPlaces });
    const saved = await school.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
