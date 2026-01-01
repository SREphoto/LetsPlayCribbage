import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

interface PegHole {
  x: number;
  y: number;
  isFivePointMark: boolean;
}

@Component({
  selector: 'app-cribbage-board',
  template: `
    <div class="bg-yellow-800/80 p-4 rounded-lg shadow-inner border-4 border-yellow-900/50 w-full">
      <svg viewBox="0 0 580 170" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
        <!-- Board Background -->
        <rect width="100%" height="100%" rx="8" ry="8" class="fill-current text-yellow-700/50" />

        <!-- Peg Holes -->
        @for(hole of pegHoles(); track $index) {
          <circle [attr.cx]="hole.x" [attr.cy]="hole.y" r="4" class="fill-current text-yellow-900/70" />
          @if(hole.isFivePointMark) {
            <circle [attr.cx]="hole.x" [attr.cy]="hole.y" r="6" class="fill-none stroke-current text-yellow-900/70" stroke-width="1.5" />
          }
        }

        <!-- Player 1 Peg -->
        @if(player1PegPosition(); as pos) {
          <circle [attr.cx]="pos.x" [attr.cy]="pos.y" r="7" class="fill-red-500 stroke-2 stroke-white transition-all" style="filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));" />
        }
        
        <!-- Player 2 Peg -->
        @if(player2PegPosition(); as pos) {
          <g transform="translate(2, 2)">
             <circle [attr.cx]="pos.x" [attr.cy]="pos.y" r="7" class="fill-blue-500 stroke-2 stroke-white transition-all" style="filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));" />
          </g>
        }
        
        <!-- Player Labels -->
        <text x="10" y="160" class="text-sm font-bold fill-red-200 transition-all" [class.animate-pulse]="lastScoringPlayerId() === 1">{{ player1Name() }}: {{ player1Score() }}</text>
        <text x="570" y="160" text-anchor="end" class="text-sm font-bold fill-blue-200 transition-all" [class.animate-pulse]="lastScoringPlayerId() === 2">{{ player2Name() }}: {{ player2Score() }}</text>
      </svg>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CribbageBoardComponent {
  player1Score = input.required<number>();
  player2Score = input.required<number>();
  player1Name = input.required<string>();
  player2Name = input.required<string>();
  lastScoringPlayerId = input<number | null>();

  pegHoles = computed<PegHole[]>(() => this.generatePegHoles());

  player1PegPosition = computed(() => {
    const score = Math.min(this.player1Score(), 121);
    if (score === 0) return null;
    // The board is 1-indexed, array is 0-indexed
    return this.pegHoles()[score - 1];
  });

  player2PegPosition = computed(() => {
    const score = Math.min(this.player2Score(), 121);
    if (score === 0) return null;
    return this.pegHoles()[score - 1];
  });

  private generatePegHoles(): PegHole[] {
    const holes: PegHole[] = [];
    const HOLE_SPACING = 18;
    const ROW_SPACING = 30;
    const START_X = 20;
    const START_Y = 40;
    const HOLES_PER_ROW = 30;

    for (let i = 0; i < 121; i++) {
      const point = i + 1;
      const row = Math.floor(i / HOLES_PER_ROW);
      const col = i % HOLES_PER_ROW;
      
      let x, y;

      if (row % 2 === 0) { // Rows 0 and 2 go left-to-right
        x = START_X + col * HOLE_SPACING;
      } else { // Rows 1 and 3 go right-to-left
        x = START_X + (HOLES_PER_ROW - 1 - col) * HOLE_SPACING;
      }
      y = START_Y + row * ROW_SPACING;

      holes.push({ x, y, isFivePointMark: point % 5 === 0 });
    }
    return holes;
  }
}