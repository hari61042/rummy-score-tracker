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
    const score = this.rounds[roundIndex][playerIndex];
    // Update player's scores array
    this.players[playerIndex].scores[roundIndex] = score;
  
    // Recalculate the total score for the player
    this.players[playerIndex].totalScore = this.players[playerIndex].scores.reduce((acc, score) => acc + score, 0);
  
    // Automatically add a new round if all players have entered a score for the current round
    if (roundIndex === this.rounds.length - 1 && this.rounds[roundIndex].every(s => s !== undefined)) {
      this.addRound();
    }
  }
  

  resetGame() {
    this.players = [];
    this.rounds = [];
    this.gameStarted = false;
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

  // Handle score input, only allow numeric values
  onScoreInput(event: any, roundIndex: number, playerIndex: number) {
    let value = event.target.value;

    // Only allow numbers (regular expression replaces anything that isn't a number)
    value = value.replace(/[^0-9]/g, '');

    // Update the score if the input is valid
    this.rounds[roundIndex][playerIndex] = value ? parseInt(value, 10) : 0;
  }
}
