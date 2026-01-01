import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject } from '@angular/core';
import { ScoringMode } from './game-setup.component';
import { CribbageScoringService, HandScore } from '../../services/cribbage-scoring.service';
import { SoundService } from '../../services/sound.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hand-scoring',
  templateUrl: './hand-scoring.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class HandScoringComponent {
  hand = input.required<string[]>();
  starterCard = input.required<string>();
  playerName = input.required<string>();
  isCrib = input.required<boolean>();
  isPlayerHand = input.required<boolean>();
  scoringMode = input.required<ScoringMode>();
  scoreCounted = output<number>();

  private scoringService = inject(CribbageScoringService);
  private soundService = inject(SoundService);

  calculatedScore = signal<HandScore | null>(null);
  playerScoreInput = signal<number | null>(null);
  isSubmitted = signal(false);
  feedbackMessage = signal('');

  readonly suits: { [key: string]: string } = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
  readonly pointsPerInstance: { [key: string]: string } = {
    'Fifteens': '2 Points Each',
    'Pairs': '2 Points Each',
    'Runs': '1 Point Per Card',
    'Flush': '1 Point Per Card',
    'Nobs': '1 Point'
  };

  ngOnInit() {
    const score = this.scoringService.calculateScore(this.hand(), this.starterCard());
    this.calculatedScore.set(score);

    if (this.scoringMode() === 'Normal' || !this.isPlayerHand()) {
      setTimeout(() => {
        if (score.totalScore > 0) this.soundService.play('score');
        this.scoreCounted.emit(score.totalScore);
      }, 1500);
    }
  }

  submitScore() {
    if (this.playerScoreInput() === null) return;
    this.isSubmitted.set(true);

    const correctScore = this.calculatedScore()!.totalScore;
    if (this.playerScoreInput() === correctScore) {
      this.feedbackMessage.set('Perfect! You got the exact score.');
      this.soundService.play('score');
    } else {
      this.feedbackMessage.set(`You counted ${this.playerScoreInput()}, but the correct score is ${correctScore}.`);
      this.soundService.play('reset');
    }

    setTimeout(() => {
      this.scoreCounted.emit(correctScore);
    }, 3000);
  }

  getCardDisplay(card: string): { rank: string, suit: string, color: string } {
    const suitKey = card.slice(-1);
    const suit = this.suits[suitKey];
    const rank = card.slice(0, -1);
    const color = (suitKey === 'H' || suitKey === 'D') ? 'text-red-500' : 'text-gray-800';
    return { rank, suit, color };
  }

  parseCombination(combo: string): string[] {
    if (!combo) return [];
    return combo.split(',').map(c => c.trim()).filter(c => c);
  }
}