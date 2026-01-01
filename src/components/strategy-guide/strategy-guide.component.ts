import { Component, ChangeDetectionStrategy, signal, computed, output, input } from '@angular/core';
import { DISCARD_STRATEGY, PEGGING_STRATEGY } from './strategy-content';
import { parseCardsInText } from '../../utils/card-parser';

interface FormattedLine {
  text: string;
  type: 'p' | 'h2' | 'h3';
}

type StrategyType = 'discarding' | 'pegging';

@Component({
  selector: 'app-strategy-guide',
  templateUrl: './strategy-guide.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'flex flex-col flex-grow min-h-0'
  }
})
export class StrategyGuideComponent {
  strategyType = input.required<StrategyType>();
  closeModal = output<void>();

  contentData = computed(() => {
    const type = this.strategyType();
    const title = type === 'discarding' ? 'Discarding Strategy Guide' : 'Pegging Strategy Guide';
    const rawContent = type === 'discarding' ? DISCARD_STRATEGY : PEGGING_STRATEGY;
    const formattedContent = this.formatContent(rawContent);
    return { title, formattedContent };
  });

  private formatContent(content: string): FormattedLine[] {
    return content.split('\n').filter(line => line.trim() !== '').map(line => {
      line = line.trim();
      if (line.startsWith('## ')) {
        return { text: line.substring(3), type: 'h2' };
      }
      if (line.startsWith('### ')) {
        return { text: line.substring(4), type: 'h3' };
      }
      return { text: parseCardsInText(line), type: 'p' };
    });
  }
}