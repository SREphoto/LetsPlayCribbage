import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { GameBoardComponent } from './game-board.component';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ScoringMode = 'Normal' | 'Learning';

@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GameBoardComponent],
})
export class GameSetupComponent {
  playerCount = signal<number>(2);
  difficulty = signal<Difficulty>('Intermediate');
  scoringMode = signal<ScoringMode>('Normal');
  gameStarted = signal<boolean>(false);

  setPlayerCount(count: number) {
    this.playerCount.set(count);
  }

  setDifficulty(level: Difficulty) {
    this.difficulty.set(level);
  }

  setScoringMode(mode: ScoringMode) {
    this.scoringMode.set(mode);
  }

  startGame() {
    this.gameStarted.set(true);
  }

  exitGame() {
    this.gameStarted.set(false);
  }
}