import { Component, ChangeDetectionStrategy, input, signal, inject } from '@angular/core';
import { SoundService } from '../../services/sound.service';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizData {
  question: string;
  hand: string[];
  starter: string;
  options: QuizOption[];
}

@Component({
  selector: 'app-interactive-quiz',
  templateUrl: './interactive-quiz.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractiveQuizComponent {
  quizData = input.required<QuizData>();
  
  selectedAnswer = signal<QuizOption | null>(null);
  feedback = signal<string>('');
  isAnswered = signal<boolean>(false);
  
  private soundService = inject(SoundService);

  readonly suits: { [key: string]: string } = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };

  getCardDisplay(card: string): { rank: string, suit: string, color: string } {
    const suitKey = card.slice(-1);
    const suit = this.suits[suitKey];
    const rank = card.slice(0, -1);
    const color = (suitKey === 'H' || suitKey === 'D') ? 'text-red-500' : 'text-gray-800';
    return { rank, suit, color };
  }
  
  selectAnswer(option: QuizOption) {
    if (this.isAnswered()) return;

    this.selectedAnswer.set(option);
    this.isAnswered.set(true);

    if (option.isCorrect) {
      this.feedback.set('Correct! Well done.');
      this.soundService.play('score');
    } else {
      this.feedback.set('Not quite. The correct answer is highlighted in green.');
      this.soundService.play('reset');
    }
  }
}