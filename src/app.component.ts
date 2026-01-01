import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { GameSetupComponent } from './components/game/game-setup.component';
import { ScoringHelperComponent } from './components/scoring-helper/scoring-helper.component';
import { ReferenceGuideComponent } from './components/reference-guide/reference-guide.component';
import { GameBoardComponent } from './components/game/game-board.component';
import { InteractiveQuizComponent } from './components/tutorial/interactive-quiz.component';
import { StrategyGuideComponent } from './components/strategy-guide/strategy-guide.component';

type View = 'home' | 'tutorial' | 'play' | 'scoring-helper' | 'reference';
type StrategyModal = 'discarding' | 'pegging';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TutorialComponent,
    GameSetupComponent,
    ScoringHelperComponent,
    ReferenceGuideComponent,
    GameBoardComponent,
    InteractiveQuizComponent,
    StrategyGuideComponent,
  ],
})
export class AppComponent {
  view = signal<View>('home');
  activeStrategyModal = signal<StrategyModal | null>(null);

  setView(view: View) {
    this.view.set(view);
  }

  openStrategyModal(type: StrategyModal) {
    this.activeStrategyModal.set(type);
  }

  closeStrategyModal() {
    this.activeStrategyModal.set(null);
  }
}