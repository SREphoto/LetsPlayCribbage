import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { QUICK_REFERENCE_GUIDE } from './quick-reference-guide';
import { parseCardsInText } from '../../utils/card-parser';

interface FormattedLine {
  text: string;
  type: 'p' | 'h2';
}

@Component({
  selector: 'app-reference-guide',
  templateUrl: './reference-guide.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferenceGuideComponent {
  guide = signal<string>(QUICK_REFERENCE_GUIDE);

  formattedGuide = computed<FormattedLine[]>(() => {
    if (!this.guide()) return [];
    
    return this.guide().split('\n').filter(line => line.trim() !== '').map(line => {
      line = line.trim();
      if (line.startsWith('## ')) {
        return { text: line.substring(3), type: 'h2' };
      }
      return { text: parseCardsInText(line), type: 'p' };
    });
  });
}
