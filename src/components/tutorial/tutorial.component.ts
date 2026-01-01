import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RULES_2_PLAYERS, RULES_3_PLAYERS, RULES_4_PLAYERS, RuleContent } from './cribbage-rules';
import { parseCardsInText } from '../../utils/card-parser';
import { InteractiveQuizComponent } from './interactive-quiz.component';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InteractiveQuizComponent],
})
export class TutorialComponent {
  playerCount = signal<number | null>(null);
  rules = signal<RuleContent[]>([]);

  formattedRules = computed(() => {
    return this.rules().map(item => {
      if (item.type === 'p' || item.type === 'h2') {
        return { ...item, content: parseCardsInText(item.content) };
      }
      return item;
    });
  });

  selectRules(count: number) {
    this.playerCount.set(count);
    switch (count) {
      case 2:
        this.rules.set(RULES_2_PLAYERS);
        break;
      case 3:
        this.rules.set(RULES_3_PLAYERS);
        break;
      case 4:
        this.rules.set(RULES_4_PLAYERS);
        break;
      default:
        this.rules.set([]);
    }
  }
}