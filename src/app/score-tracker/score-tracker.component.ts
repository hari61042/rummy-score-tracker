import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

interface Player {
  name: string;
  totalScore: number;
  scores: number[];
}

@Component({
  selector: 'app-score-tracker',
  templateUrl: './score-tracker.component.html',
  styleUrls: ['./score-tracker.component.css']
})
export class ScoreTrackerComponent implements AfterViewInit {
  @ViewChild('playerNameInput') playerNameInput: ElementRef<HTMLInputElement> | undefined;
  players: Player[] = [];
  rounds: number[][] = [];
  newPlayerName = '';
  gameStarted = false;
  targetScore: number = 200;  
  winnerDialogVisible = false;
  winnerName: string = '';

  barChartData: any;
  barChartOptions: any;


  ngOnInit() {
    this.initializeBarChart();
  }

  ngAfterViewInit() {
    if (this.playerNameInput) {
      this.playerNameInput.nativeElement.focus();
    }
  }

  addPlayer() {
    if (this.newPlayerName.trim() !== '') {
      this.players.push({
        name: this.newPlayerName,
        totalScore: 0,
        scores: []
      });
      this.newPlayerName = ''; // Reset player input field
      setTimeout(() => {
        if (this.playerNameInput) {
          this.playerNameInput.nativeElement.focus();
        }
      });
    }
  }

  //Code to delete the player
  deletePlayer(index: number) {
    // Remove the player from the players array
    this.players.splice(index, 1);
  
    // Remove the corresponding scores from each round
    this.rounds.forEach(round => round.splice(index, 1));
  
    // Check if the game should continue or be reset
    if (this.players.length <= 1 && this.gameStarted) {
      this.gameStarted = false;
      this.winnerDialogVisible = false;
      this.resetGame();
    }
  }
  

  startGame() {
    if (this.players.length > 0) {
      this.gameStarted = true;
      this.addRound();
    }
  }

  addRound() {
    if (this.players.length > 0) {
      const newRound = new Array(this.players.length).fill(0);
      this.rounds.push(newRound);
    }
  }

  updateScores(roundIndex: number, playerIndex: number) {
    if (this.isPlayerEliminated(this.players[playerIndex])) {
      return;
    }
  
    const score = this.rounds[roundIndex][playerIndex];
    this.players[playerIndex].scores[roundIndex] = score;
    this.players[playerIndex].totalScore = this.players[playerIndex].scores.reduce((acc, score) => acc + score, 0);
  
    this.updateBarChart();
    if (roundIndex === this.rounds.length - 1 && this.rounds[roundIndex].every(s => s !== undefined)) {
      this.addRound();
    }
  
    this.checkForEliminations();
  }

  resetGame() {
    this.players = [];
    this.rounds = [];
    this.gameStarted = false;
  }

  updateTarget() {
    // Allow updating of the target score
    console.log("Target score updated to", this.targetScore);
  }

  get highestScorePlayer() {
    return this.players.reduce((max, player) => (player.totalScore > max.totalScore ? player : max), this.players[0]);
  }

  get lowestScorePlayer() {
    return this.players.reduce((min, player) => (player.totalScore < min.totalScore ? player : min), this.players[0]);
  }

  // Convert player name to uppercase
  toUpperCase(event: any) {
    this.newPlayerName = event.target.value.toUpperCase();
  }

  // Check if the player has reached the target score
  isPlayerEliminated(player: Player): boolean {
    return player.totalScore >= this.targetScore;
  }

  // Check if only one player is left and show the winner dialog
  checkForEliminations() {
    const remainingPlayers = this.players.filter(player => player.totalScore < this.targetScore);
    if (remainingPlayers.length === 1) {
      this.winnerName = remainingPlayers[0].name;
      this.winnerDialogVisible = true;
    }
  }

  // Close winner dialog
  closeWinnerDialog() {
    this.winnerDialogVisible = false;
  }

  // Handle score input, only allow numeric values
  onScoreInput(event: any, roundIndex: number, playerIndex: number) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    this.rounds[roundIndex][playerIndex] = value ? parseInt(value, 10) : 0;
  }

  isScoreEditable(player: Player): boolean {
    return player.totalScore < this.targetScore;
  }

  initializeBarChart() {
    const playerNames = this.players.map((player) => player.name);
    const playerScores = this.players.map((player) => player.totalScore);

    // Bar Chart Data
    this.barChartData = {
      labels: playerNames,
      datasets: [
        {
          label: 'Total Scores',
          data: playerScores,
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043', '#AB47BC'],
          borderColor: ['#1E88E5', '#43A047', '#FB8C00', '#F4511E', '#8E24AA'],
          borderWidth: 1,
        },
      ],
    };

    // Bar Chart Options
    this.barChartOptions = {
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            // text: 'Score',
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  updateBarChart() {
    this.initializeBarChart();
  }

  deleteRound(roundIndex: number) {
    this.rounds.splice(roundIndex, 1);
    this.players.forEach((player, playerIndex) => {
      player.scores = this.rounds.map((round) => round[playerIndex] || 0);
      player.totalScore = player.scores.reduce((acc, score) => acc + score, 0);
    });
    this.checkForEliminations();
  }
}
