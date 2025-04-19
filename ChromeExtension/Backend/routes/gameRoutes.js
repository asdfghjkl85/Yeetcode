import express from 'express';
import { getAllGames, createGame, joinGame, updateGame, deleteAllGames, updateGameStatus, updateGameProblems, getGameById } from '../controllers/gameController.js';

const router = express.Router();

// Game Routes
router.get('/', getAllGames);
router.post('/', createGame);
router.post('/join', joinGame);
router.patch('/:id', updateGame);
router.patch('/:id/status', updateGameStatus);
router.delete('/', deleteAllGames); 
router.patch('/:id/problems',updateGameProblems)
router.get('/:id', getGameById);

export default router;