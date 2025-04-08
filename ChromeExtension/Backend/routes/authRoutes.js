import express from 'express';
import { signup } from '../controllers/authController.js';

const router = express.Router();

// User Routes
router.post('/signup', signup);

export default router;
