import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CribbageScoringService, HandScore } from '../../services/cribbage-scoring.service';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-scoring-helper',
  templateUrl: './scoring-helper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoringHelperComponent {
  private scoringService = inject(CribbageScoringService);
  private soundService = inject(SoundService);

  readonly suits = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
  readonly ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  readonly pointsPerInstance: { [key: string]: string } = {
    'Fifteens': '2 Points Each',
    'Pairs': '2 Points Each',
    'Runs': '1 Point Per Card',
    'Flush': '1 Point Per Card',
    'Nobs': '1 Point'
  };

  get suitKeys(): string[] {
    return Object.keys(this.suits);
  }

  hand = signal<string[]>([]);
  starter = signal<string | null>(null);
  score = signal<HandScore | null>(null);
  error = signal<string | null>(null);

  selectedRank = signal<string | null>(null);

  selectionPrompt = computed(() => {
    if (this.hand().length < 4) {
      return `Select card ${this.hand().length + 1} of 4 for your hand.`;
    }
    if (!this.starter()) {
      return 'Select the starter card.';
    }
    return 'Your hand is complete.';
  });
  
  isCardSelected(card: string): boolean {
    return this.hand().includes(card) || this.starter() === card;
  }

  onRankSelect(rank: string) {
    this.soundService.play('select');
    this.selectedRank.set(this.selectedRank() === rank ? null : rank);
  }

  onSuitSelect(suitKey: string) {
    const rank = this.selectedRank();
    if (!rank) {
      return;
    }

    this.soundService.play('play');
    const card = `${rank}${suitKey}`;
    if (this.isCardSelected(card)) {
      return;
    }

    if (this.hand().length < 4) {
      this.hand.update(h => [...h, card]);
    } else if (!this.starter()) {
      this.starter.set(card);
    }
    
    this.selectedRank.set(null);
  }

  reset() {
    this.soundService.play('reset');
    this.hand.set([]);
    this.starter.set(null);
    this.score.set(null);
    this.error.set(null);
    this.selectedRank.set(null);
  }

  removeCard(cardToRemove: string) {
    this.soundService.play('select');
    if (this.starter() === cardToRemove) {
      this.starter.set(null);
    } else {
      this.hand.update(h => h.filter(c => c !== cardToRemove));
    }
  }

  calculateScore() {
    if (this.hand().length !== 4 || !this.starter()) {
      this.error.set('Please select 4 cards for your hand and 1 starter card.');
      return;
    }
    
    this.error.set(null);
    this.score.set(null);

    const result = this.scoringService.calculateScore(this.hand(), this.starter()!);
    this.score.set(result);
    if (result.totalScore > 0) {
      this.soundService.play('score');
    }
  }
  
  getCardDisplay(card: string): { rank: string, suit: string, color: string } {
    const suitKey = card.slice(-1);
    const suit = this.suits[suitKey as keyof typeof this.suits];
    const rank = card.slice(0, -1);
    const color = (suitKey === 'H' || suitKey === 'D') ? 'text-red-500' : 'text-gray-800';
    return { rank, suit, color };
  }

  parseCombination(combo: string): string[] {
    if (!combo) return [];
    return combo.split(',').map(c => c.trim()).filter(c => c);
  }
}