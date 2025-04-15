import express from 'express';
import { getAllGames, createGame, joinGame, updateGame, deleteAllGames, updateGameStatus, updateGameProblems } from '../controllers/gameController.js';
import { getGameProblems } from '../controllers/problemUpdateController.js';

const router = express.Router();

// Game Routes
router.get('/', getAllGames);
router.post('/', createGame);
router.post('/join', joinGame);
router.patch('/:id', updateGame);
router.patch('/:id/status', updateGameStatus);
router.delete('/', deleteAllGames); 
router.patch('/:id/problems',updateGameProblems)
router.get('/:id/problems', getGameProblems); 
export default router;