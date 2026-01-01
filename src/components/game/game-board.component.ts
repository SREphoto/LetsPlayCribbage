import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { Difficulty, ScoringMode } from './game-setup.component';
import { DeckService } from '../../services/deck.service';
import { SoundService } from '../../services/sound.service';
import { CribbageScoringService } from '../../services/cribbage-scoring.service';
import { CribbageBoardComponent } from './cribbage-board.component';
import { HandScoringComponent } from './hand-scoring.component';

interface Player {
  id: number;
  name: string;
  isAi: boolean;
  hand: string[];
  score: number;
}

type GamePhase = 'cut_for_deal' | 'dealing' | 'discarding' | 'starter' | 'pegging' | 'score_non_dealer' | 'score_dealer' | 'score_crib' | 'game_over';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CribbageBoardComponent, HandScoringComponent],
})
export class GameBoardComponent {
  playerCount = input.required<number>();
  difficulty = input.required<Difficulty>();
  scoringMode = input.required<ScoringMode>();
  exitGame = output<void>();

  players = signal<Player[]>([]);
  humanPlayer = computed(() => this.players().find(p => !p.isAi));
  aiPlayer = computed(() => this.players().find(p => p.isAi));
  aiHandPlaceholders = computed(() => {
    const handLength = this.aiPlayer()?.hand.length ?? 0;
    return Math.max(0, 4 - handLength);
  });

  phase = signal<GamePhase>('cut_for_deal');
  gameMessage = signal<string>('');
  
  deck = signal<string[]>([]);
  crib = signal<string[]>([]);
  starterCard = signal<string | null>(null);
  dealerId = signal<number>(1);
  
  peggingPile = signal<string[]>([]);
  peggingTotal = signal(0);
  currentPlayerId = signal(2);
  
  selectedDiscards = signal<string[]>([]);

  passedPlayerId = signal<number | null>(null);
  lastPlayerToPlayCardId = signal<number | null>(null);
  
  playerHandsAfterDiscard = signal<{ [playerId: number]: string[] }>({});
  currentScoringHand = signal<{ hand: string[], playerName: string, isCrib: boolean, playerId: number } | null>(null);

  humanCutCard = signal<string | null>(null);
  aiCutCard = signal<string | null>(null);
  isFirstRound = signal<boolean>(true);

  // Signals for animations
  lastScoringPlayerId = signal<number | null>(null);
  countJustUpdated = signal(false);

  canHumanPlay = computed(() => {
    if (this.phase() !== 'pegging' || this.currentPlayerId() !== this.humanPlayer()?.id) {
      return true; // Not the human's turn to play, so don't show "Go"
    }
    const hand = this.humanPlayer()?.hand ?? [];
    return hand.some(card => this.getCardValue(card) + this.peggingTotal() <= 31);
  });

  readonly suits: { [key: string]: string } = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };

  constructor(
    private deckService: DeckService,
    private soundService: SoundService,
    private scoringService: CribbageScoringService
  ) {}

  ngOnInit() {
    this.initializeGame();
  }

  initializeGame() {
    const players: Player[] = [
      { id: 1, name: 'You', isAi: false, hand: [], score: 0 },
      { id: 2, name: 'AI', isAi: true, hand: [], score: 0 }
    ];
    this.players.set(players);
    this.phase.set('cut_for_deal');
    this.isFirstRound.set(true);
    this.gameMessage.set('Click the deck to cut for the first deal.');
  }

  private processNextTurn() {
    const currentPlayer = this.players().find(p => p.id === this.currentPlayerId());
    if (this.phase() === 'pegging' && (currentPlayer?.isAi)) {
      setTimeout(() => this.runAiPeggingTurn(), 1200);
    }
  }
  
  cutForDeal() {
    this.soundService.play('shuffle');
    const tempDeck = this.deckService.shuffle(this.deckService.createDeck());
    const humanCut = tempDeck[Math.floor(Math.random() * 26)];
    const aiCut = tempDeck[26 + Math.floor(Math.random() * 26)];
    
    this.humanCutCard.set(humanCut);
    this.aiCutCard.set(aiCut);
    
    const humanRank = this.getCardRankOrder(humanCut);
    const aiRank = this.getCardRankOrder(aiCut);
    
    if (humanRank === aiRank) {
        this.gameMessage.set("It's a tie! Cutting again...");
        setTimeout(() => {
            this.humanCutCard.set(null);
            this.aiCutCard.set(null);
            this.cutForDeal();
        }, 2000);
        return;
    }

    const humanDeals = humanRank < aiRank;
    this.dealerId.set(humanDeals ? 1 : 2);
    
    const dealerName = humanDeals ? this.humanPlayer()!.name : this.aiPlayer()!.name;
    const humanCardRank = this.getCardDisplay(humanCut).rank;
    const aiCardRank = this.getCardDisplay(aiCut).rank;
    
    this.gameMessage.set(`${this.humanPlayer()!.name} cut a ${humanCardRank}, ${this.aiPlayer()!.name} cut an ${aiCardRank}. ${dealerName} deals first.`);
    
    setTimeout(() => {
        this.startNewRound();
    }, 3500);
  }

  startNewRound() {
    if (this.isFirstRound()) {
        this.isFirstRound.set(false);
    } else {
        this.dealerId.update(id => id === 1 ? 2 : 1);
    }
    
    this.humanCutCard.set(null);
    this.aiCutCard.set(null);
    this.phase.set('dealing');
    this.gameMessage.set(this.dealerId() === 1 ? "You are the dealer." : "AI is the dealer.");
    this.crib.set([]);
    this.starterCard.set(null);
    this.peggingPile.set([]);
    this.peggingTotal.set(0);
    this.selectedDiscards.set([]);
    this.passedPlayerId.set(null);
    this.lastPlayerToPlayCardId.set(null);
    this.playerHandsAfterDiscard.set({});
    this.currentScoringHand.set(null);

    setTimeout(() => {
      this.soundService.play('shuffle');
      const fullDeck = this.deckService.shuffle(this.deckService.createDeck());
      
      const p1Hand = fullDeck.slice(0, 6);
      const p2Hand = fullDeck.slice(6, 12);
      this.deck.set(fullDeck.slice(12));
      
      this.players.update(players => players.map(p => ({
        ...p,
        hand: p.id === 1 ? p1Hand : p2Hand,
      })));
      
      this.phase.set('discarding');
      this.gameMessage.set("Select 2 cards for the crib.");

      if (this.aiPlayer()?.hand.length === 6) {
        this.runAiDiscard();
      }
    }, 1000);
  }

  handleCardClick(card: string) {
    if (this.phase() === 'discarding' && this.humanPlayer()?.hand.includes(card)) {
      this.toggleDiscardSelection(card);
    } else if (this.phase() === 'pegging' && this.currentPlayerId() === this.humanPlayer()?.id) {
      this.playCard(card);
    }
  }

  toggleDiscardSelection(card: string) {
    this.soundService.play('select');
    const currentSelection = this.selectedDiscards();
    if (currentSelection.includes(card)) {
      this.selectedDiscards.set(currentSelection.filter(c => c !== card));
    } else if (currentSelection.length < 2) {
      this.selectedDiscards.update(s => [...s, card]);
    }

    const selectionCount = this.selectedDiscards().length;
    if (selectionCount < 2) {
      const remaining = 2 - selectionCount;
      this.gameMessage.set(`Select ${remaining} more card${remaining > 1 ? 's' : ''} for the crib.`);
    } else {
      this.gameMessage.set('Ready to discard. Press Confirm.');
    }
  }

  confirmDiscard() {
    if (this.selectedDiscards().length !== 2) return;

    this.soundService.play('play');
    const discards = this.selectedDiscards();

    this.crib.update(c => [...c, ...discards]);

    this.players.update(players => {
      const human = players.find(p => !p.isAi)!;
      human.hand = human.hand.filter(c => !discards.includes(c));
      return [...players];
    });

    this.selectedDiscards.set([]);
    this.checkDiscardPhaseEnd();
  }

  runAiDiscard() {
    setTimeout(() => {
      const ai = this.aiPlayer()!;
      const isDealer = ai.id === this.dealerId();
      const discards = this.chooseAiDiscards([...ai.hand], isDealer);

      this.crib.update(c => [...c, ...discards]);
      this.players.update(players => {
        const aiPlayer = players.find(p => p.isAi)!;
        aiPlayer.hand = aiPlayer.hand.filter(c => !discards.includes(c));
        return [...players];
      });
      
      this.soundService.play('play');
      this.checkDiscardPhaseEnd();
    }, 1500);
  }

  checkDiscardPhaseEnd() {
    if (this.crib().length === 4) {
      const hands: { [playerId: number]: string[] } = {};
      for (const player of this.players()) {
          hands[player.id] = [...player.hand];
      }
      this.playerHandsAfterDiscard.set(hands);

      this.phase.set('starter');
      this.gameMessage.set("Cut for starter card...");
      setTimeout(() => this.revealStarterCard(), 1000);
    }
  }

  revealStarterCard() {
    const starter = this.deck().pop()!;
    this.starterCard.set(starter);
    this.soundService.play('play');
    this.deck.set([...this.deck()]);
    
    if (starter.startsWith('J')) {
      this.gameMessage.set(`Starter is a Jack! Dealer gets 2 points for "His Heels".`);
      this.addScore(this.dealerId(), 2);
      setTimeout(() => this.startPegging(), 2000);
    } else {
      this.startPegging();
    }
  }

  startPegging() {
    this.phase.set('pegging');
    this.currentPlayerId.set(this.dealerId() === 1 ? 2 : 1);
    this.gameMessage.set(this.currentPlayerId() === 1 ? "Your turn to play." : "AI's turn.");
    this.processNextTurn();
  }

  runAiPeggingTurn() {
     this.gameMessage.set("AI is thinking...");
     const ai = this.aiPlayer()!;
     const validPlays = ai.hand.filter(card => this.getCardValue(card) + this.peggingTotal() <= 31);

     if (validPlays.length > 0) {
       this.playCard(validPlays[0]);
     } else {
       this.handleGo();
     }
  }

  playCard(card: string) {
    const cardValue = this.getCardValue(card);
    if (this.peggingTotal() + cardValue > 31) return;

    this.soundService.play('play');
    
    this.lastPlayerToPlayCardId.set(this.currentPlayerId());
    this.passedPlayerId.set(null);

    this.players.update(players => {
       const p = players.find(pl => pl.id === this.currentPlayerId())!;
       p.hand = p.hand.filter(c => c !== card);
       return [...players];
    });

    this.peggingTotal.update(t => t + cardValue);
    this.countJustUpdated.set(true);
    setTimeout(() => this.countJustUpdated.set(false), 500);
    
    this.peggingPile.update(p => [...p, card]);

    const allCardsPlayed = this.players().every(p => p.hand.length === 0);
    if (allCardsPlayed) {
        if (this.peggingTotal() < 31) {
            this.addScore(this.currentPlayerId(), 1);
            this.gameMessage.set(`${this.players().find(p => p.id === this.currentPlayerId())!.name} scores 1 for last card.`);
        }
        this.checkPeggingScore();
        setTimeout(() => this.startScoringPhase(), 2000);
        return;
    }

    const didScore = this.checkPeggingScore();

    if (this.peggingTotal() < 31) {
        const delay = didScore ? 1500 : 200;
        setTimeout(() => {
          this.currentPlayerId.update(id => (id % this.players().length) + 1);
          this.gameMessage.set(this.currentPlayerId() === 1 ? "Your turn." : "AI's turn.");
          this.processNextTurn();
        }, delay);
    }
  }

  checkPeggingScore(): boolean {
    let totalPoints = 0;
    const scoreMessages: string[] = [];
    const peggingTotal = this.peggingTotal();
    
    if (peggingTotal === 15 || peggingTotal === 31) {
        totalPoints += 2;
        scoreMessages.push(`${peggingTotal} for 2`);
    }

    const pile = this.peggingPile();
    if (pile.length >= 2) {
        const ranks = pile.map(c => c.slice(0, -1));
        if (ranks[ranks.length-1] === ranks[ranks.length-2]) {
            if (ranks.length >= 3 && ranks[ranks.length-1] === ranks[ranks.length-3]) {
                if (ranks.length >= 4 && ranks[ranks.length-1] === ranks[ranks.length-4]) {
                    totalPoints += 12; scoreMessages.push("a Double Pair Royal for 12");
                } else {
                    totalPoints += 6; scoreMessages.push("a Pair Royal for 6");
                }
            } else {
                totalPoints += 2; scoreMessages.push("a Pair for 2");
            }
        }
    }

    if (totalPoints > 0) {
        const playerName = this.players().find(p => p.id === this.currentPlayerId())!.name;
        this.soundService.play('score');
        this.addScore(this.currentPlayerId(), totalPoints);
        this.gameMessage.set(`${playerName} scores ${scoreMessages.join(' & ')}!`);
    }

    if (peggingTotal === 31) {
      setTimeout(() => {
        this.gameMessage.set(`Count is 31. Resetting.`);
        this.peggingPile.set([]);
        this.peggingTotal.set(0);
        this.passedPlayerId.set(null);
        setTimeout(() => {
          if (this.players().every(p => p.hand.length === 0)) {
            this.startScoringPhase();
          } else {
            this.currentPlayerId.update(id => (id % this.players().length) + 1);
            this.gameMessage.set(this.currentPlayerId() === 1 ? "Your turn." : "AI's turn.");
            this.processNextTurn();
          }
        }, 1000);
      }, totalPoints > 0 ? 1500 : 200);
    }
    return totalPoints > 0;
  }

  handleGo() {
    this.soundService.play('go');
    const currentPlayer = this.players().find(p => p.id === this.currentPlayerId())!;
    this.gameMessage.set(`${currentPlayer.name} said 'Go'.`);

    if (this.passedPlayerId() !== null) {
      setTimeout(() => {
        this.gameMessage.set(`Both players pass. ${this.players().find(p => p.id === this.lastPlayerToPlayCardId()!)!.name} scores 1 for the 'Go'.`);
        this.addScore(this.lastPlayerToPlayCardId()!, 1);
        setTimeout(() => {
          this.gameMessage.set(`Pegging count reset.`);
          this.peggingPile.set([]);
          this.peggingTotal.set(0);
          
          if (this.players().every(p => p.hand.length === 0)) {
            this.startScoringPhase();
          } else {
            this.currentPlayerId.set(this.passedPlayerId()!); // Player who said go first starts
            this.passedPlayerId.set(null);
            this.gameMessage.set(this.currentPlayerId() === 1 ? "Your turn." : "AI's turn.");
            this.processNextTurn();
          }
        }, 1500);
      }, 1000);
      return;
    }

    this.passedPlayerId.set(this.currentPlayerId());
    this.currentPlayerId.update(id => (id % this.players().length) + 1);
    this.processNextTurn();
  }

  startScoringPhase() {
    this.phase.set('score_non_dealer');
    this.peggingPile.set([]);
    this.peggingTotal.set(0);

    const nonDealerId = this.dealerId() === 1 ? 2 : 1;
    const nonDealer = this.players().find(p => p.id === nonDealerId)!;
    
    this.gameMessage.set(`Scoring ${nonDealer.name}'s hand.`);
    this.currentScoringHand.set({
      hand: this.playerHandsAfterDiscard()[nonDealerId],
      playerName: nonDealer.name,
      isCrib: false,
      playerId: nonDealerId
    });
  }

  handleScoreCounted(score: number) {
    const { playerId } = this.currentScoringHand()!;
    this.addScore(playerId, score);
    
    const currentPhase = this.phase();
    this.currentScoringHand.set(null);
    
    setTimeout(() => {
      if (currentPhase === 'score_non_dealer') {
        this.phase.set('score_dealer');
        const dealer = this.players().find(p => p.id === this.dealerId())!;
        this.gameMessage.set(`Scoring ${dealer.name}'s hand.`);
        this.currentScoringHand.set({
          hand: this.playerHandsAfterDiscard()[this.dealerId()],
          playerName: dealer.name,
          isCrib: false,
          playerId: this.dealerId()
        });
      } else if (currentPhase === 'score_dealer') {
        this.phase.set('score_crib');
        const dealer = this.players().find(p => p.id === this.dealerId())!;
        this.gameMessage.set(`Scoring the crib for ${dealer.name}.`);
        this.currentScoringHand.set({
          hand: this.crib(),
          playerName: dealer.name,
          isCrib: true,
          playerId: this.dealerId()
        });
      } else if (currentPhase === 'score_crib') {
        const winner = this.players().find(p => p.score >= 121);
        if (winner) {
          this.phase.set('game_over');
          this.gameMessage.set(`${winner.name} wins the game!`);
        } else {
          this.startNewRound();
        }
      }
    }, this.scoringMode() === 'Learning' ? 3500 : 2500);
  }

  addScore(playerId: number, points: number) {
    this.players.update(players => {
      const p = players.find(pl => pl.id === playerId)!;
      p.score += points;
      return [...players];
    });

    if (this.phase() === 'pegging' || this.phase() === 'starter') {
        this.lastScoringPlayerId.set(playerId);
        setTimeout(() => this.lastScoringPlayerId.set(null), 1500);
    }
  }

  getCardValue(card: string): number {
    const rank = card.slice(0, -1);
    if (['K', 'Q', 'J', '10'].includes(rank)) return 10;
    if (rank === 'A') return 1;
    return parseInt(rank, 10);
  }

  private getCardRankOrder(card: string): number {
    const rank = card.slice(0, -1);
    const rankMap: { [key:string]: number } = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };
    return rankMap[rank];
  }

  getCardDisplay(card: string): { rank: string, suit: string, color: string } {
    const suitKey = card.slice(-1);
    const suit = this.suits[suitKey as keyof typeof this.suits];
    const rank = card.slice(0, -1);
    const color = (suitKey === 'H' || suitKey === 'D') ? 'text-red-500' : 'text-gray-800';
    return { rank, suit, color };
  }

  getCardClasses(card: string): string {
    const baseClasses = 'p-2 w-16 h-24 bg-white rounded-lg shadow-xl flex flex-col justify-between items-center font-bold text-xl transition-all duration-200';
    
    let stateClasses = '';

    if (this.phase() === 'discarding') {
        stateClasses += ' cursor-pointer';
        if (this.selectedDiscards().includes(card)) {
            stateClasses += ' -translate-y-4 border-4 border-yellow-400';
        } else {
            stateClasses += ' hover:-translate-y-2';
        }
    } else if (this.phase() === 'pegging' && this.currentPlayerId() === this.humanPlayer()?.id) {
        stateClasses += ' cursor-pointer hover:border-2 hover:border-green-400 hover:-translate-y-2';
    } else {
        stateClasses += ' cursor-default';
    }
    
    return `${baseClasses} ${stateClasses}`;
  }
  
  // AI Discard Helpers
  private chooseAiDiscards(hand: string[], isDealer: boolean): string[] {
    const combinations: {hand: string[], discards: string[]}[] = [];
    for (let i = 0; i < hand.length; i++) {
        for (let j = i + 1; j < hand.length; j++) {
            const discards = [hand[i], hand[j]];
            const keptHand = hand.filter(c => !discards.includes(c));
            combinations.push({hand: keptHand, discards: discards});
        }
    }

    let bestCombination: {hand: string[], discards: string[]} | null = null;
    let bestScore = -1000;

    for (const combo of combinations) {
        const handPotential = this.evaluateHandPotential(combo.hand);
        const cribPotential = this.evaluateCribPotential(combo.discards);
        const score = isDealer ? handPotential + cribPotential : handPotential - cribPotential;

        if (score > bestScore) {
            bestScore = score;
            bestCombination = combo;
        }
    }
    return bestCombination!.discards;
  }
  
  private evaluateHandPotential(hand: string[]): number {
    let score = 0;
    const findCombinations = (startIndex: number, currentSum: number) => {
      if (currentSum === 15) {
        score += 2;
        return;
      }
      if (currentSum > 15 || startIndex >= hand.length) return;
      for (let i = startIndex; i < hand.length; i++) {
        findCombinations(i + 1, currentSum + this.getCardValue(hand[i]));
      }
    };
    findCombinations(0, 0);

    const ranks = hand.map(c => c.slice(0, -1));
    const rankCounts = ranks.reduce((acc, rank) => {
        acc[rank] = (acc[rank] || 0) + 1;
        return acc;
    }, {} as {[key: string]: number});
    Object.values(rankCounts).forEach(count => {
        if (count === 2) score += 2;
        if (count === 3) score += 6;
        if (count === 4) score += 12;
    });
    return score;
  }

  private evaluateCribPotential(cards: string[]): number {
    let score = 0;
    if (cards.some(c => c.startsWith('5'))) score += 4;
    if (this.getCardRankOrder(cards[0]) === this.getCardRankOrder(cards[1])) score += 2;
    if (this.getCardValue(cards[0]) + this.getCardValue(cards[1]) === 15) score += 2;
    const rankDiff = Math.abs(this.getCardRankOrder(cards[0]) - this.getCardRankOrder(cards[1]));
    if (rankDiff === 1) score += 1;
    return score;
  }
}