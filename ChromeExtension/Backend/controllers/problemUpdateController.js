import Game from "../models/gameModel.js";

export const getGameProblems = async (req, res) => {
    const { id } = req.params;
    if(!id || id === "null") {
      return res.status(400).json({ error: "Invalid game ID" });
    }
  
    try {
      const game = await Game.findById(id);
      if (!game) {
        return res.status(404).json({ message: 'Game not found (invalid id)' });
      }
    
  
      return res.json({ leetcodeProblems: game.leetcodeProblems });
    } catch (error) {
      console.error('Error fetching problems:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  