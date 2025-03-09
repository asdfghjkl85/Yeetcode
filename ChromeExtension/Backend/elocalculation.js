class Player {
    constructor(elo = 1500, rd = 50) {
        this.elo = elo;
        this.rd = rd;
        this.gamesPlayed = 0;
        this.lastActive = Date.now();
    }

    expectedScore(opponentElo) {
        return this.elo;
    }
    
    updateRating(opponent, result, hoursInactive, questionsSolved) {
        // Calculate RD dynamically
        this.rd = Math.max(1, 20 / Math.log2(this.gamesPlayed + 2));
        opponent.rd = Math.max(1, 20 / Math.log2(opponent.gamesPlayed + 2));
        
        // Adjust rating change based on questions solved
        let questionFactor = 1.0;
        if (result === 0) { 
            if (questionsSolved === 0) questionFactor = 1.2; 
            else if (questionsSolved === 2) questionFactor = 0.8;
        }
        
        let ratingChange = this.rd * 15 * (result === 1 ? 1 : -1) * questionFactor;
        let opponentRatingChange = opponent.rd * 15 * (result === 1 ? -1 : 1) * (2 - questionFactor);
        
        this.elo += ratingChange;
        opponent.elo += opponentRatingChange;
        
        this.gamesPlayed++;
        opponent.gamesPlayed++;
        
        this.lastActive = Date.now();
        opponent.lastActive = Date.now();
        
        this.handleInactivity(hoursInactive);
        opponent.handleInactivity(hoursInactive);
    }
    
    handleInactivity(hoursInactive) {
        if (hoursInactive > 0) {
            let weeksInactive = Math.floor(hoursInactive / (7 * 24));
            this.rd = Math.min(50, this.rd + 3 * weeksInactive);
        }
    }
}    

function simulate() {
    let player1 = new Player(1500, 20);
    let player2 = new Player(1500, 20);
    console.log(`Starting: Player 1 Elo = ${player1.elo}, RD = ${player1.rd}`);
    console.log(`Starting: Player 2 Elo = ${player2.elo}, RD = ${player2.rd}`);

    for (let i = 1; i <= 10; i++) {
        let result = 1; 
        let hoursInactive = 0;
        let questionsSolved = Math.floor(Math.random() * 3);
        
        player1.updateRating(player2, result, hoursInactive, questionsSolved);
        let outcome = result === 1 ? "Player 1 Wins" : "Player 2 Wins";
        console.log(`Game ${i}: ${outcome}, Questions Solved = ${questionsSolved}, Player 1 Elo = ${Math.round(player1.elo)}, RD = ${Math.round(player1.rd)}, Player 2 Elo = ${Math.round(player2.elo)}, RD = ${Math.round(player2.rd)}`);
    }

    let hoursInactive = 7 * 24 * 4; 
    player1.handleInactivity(hoursInactive);
    player2.handleInactivity(hoursInactive);
    console.log(`After ${hoursInactive / (7 * 24)} weeks inactive: Player 1 Elo = ${Math.round(player1.elo)}, RD = ${Math.round(player1.rd)}, Player 2 Elo = ${Math.round(player2.elo)}, RD = ${Math.round(player2.rd)}`);
}

simulate();
