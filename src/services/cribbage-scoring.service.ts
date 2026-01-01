import { Injectable } from '@angular/core';

// These interfaces are consumed by the component, so they must be exported.
export interface ScoreBreakdown {
  type: string;
  points: number;
  combinations: string[];
}

export interface HandScore {
  totalScore: number;
  breakdown: ScoreBreakdown[];
}

@Injectable({
  providedIn: 'root',
})
export class CribbageScoringService {

  // For Fifteens
  private getCardValue(card: string): number {
    const rank = card.slice(0, -1);
    if (['K', 'Q', 'J', '10'].includes(rank)) return 10;
    if (rank === 'A') return 1;
    return parseInt(rank, 10);
  }

  // For Runs
  private getCardRankOrder(card: string): number {
    const rank = card.slice(0, -1);
    const rankMap: { [key: string]: number } = {
        'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
    };
    return rankMap[rank];
  }

  public calculateScore(hand: string[], starter: string): HandScore {
    const fullHand = [...hand, starter];
    let totalScore = 0;
    const breakdown: ScoreBreakdown[] = [];

    const scoringFunctions = [
      () => this.findFifteens(fullHand),
      () => this.findPairs(fullHand),
      () => this.findRuns(fullHand),
      () => this.findFlush(hand, starter),
      () => this.findNobs(hand, starter),
    ];

    for (const func of scoringFunctions) {
        const result = func();
        if (result && result.points > 0) {
            breakdown.push(result);
            totalScore += result.points;
        }
    }
    
    // Ensure consistent order of breakdown for display
    breakdown.sort((a, b) => {
        const order = ['Fifteens', 'Pairs', 'Runs', 'Flush', 'Nobs'];
        return order.indexOf(a.type) - order.indexOf(b.type);
    });

    return { totalScore, breakdown };
  }

  private findFifteens(cards: string[]): ScoreBreakdown {
    const combinations: string[] = [];
    const findCombinations = (startIndex: number, currentSum: number, currentCombo: string[]) => {
      if (currentSum === 15) {
        combinations.push(currentCombo.join(', '));
        return;
      }
      if (currentSum > 15 || startIndex >= cards.length) {
        return;
      }

      for (let i = startIndex; i < cards.length; i++) {
        const card = cards[i];
        const cardValue = this.getCardValue(card);
        findCombinations(i + 1, currentSum + cardValue, [...currentCombo, card]);
      }
    };

    findCombinations(0, 0, []);

    return {
      type: 'Fifteens',
      points: combinations.length * 2,
      combinations,
    };
  }

  private findPairs(cards: string[]): ScoreBreakdown {
    const rankCounts: { [key: string]: string[] } = {};
    cards.forEach(card => {
      const rank = card.slice(0, -1);
      if (!rankCounts[rank]) {
        rankCounts[rank] = [];
      }
      rankCounts[rank].push(card);
    });

    const combinations: string[] = [];
    let points = 0;

    Object.values(rankCounts).forEach(group => {
      if (group.length === 2) { // Pair
        points += 2;
        combinations.push(group.join(', '));
      } else if (group.length === 3) { // Three of a kind (3 pairs)
        points += 6;
        combinations.push(`${group[0]}, ${group[1]}`);
        combinations.push(`${group[0]}, ${group[2]}`);
        combinations.push(`${group[1]}, ${group[2]}`);
      } else if (group.length === 4) { // Four of a kind (6 pairs)
        points += 12;
        combinations.push(`${group[0]}, ${group[1]}`);
        combinations.push(`${group[0]}, ${group[2]}`);
        combinations.push(`${group[0]}, ${group[3]}`);
        combinations.push(`${group[1]}, ${group[2]}`);
        combinations.push(`${group[1]}, ${group[3]}`);
        combinations.push(`${group[2]}, ${group[3]}`);
      }
    });

    return {
      type: 'Pairs',
      points,
      combinations,
    };
  }

  private findRuns(cards: string[]): ScoreBreakdown {
    const uniqueRanks = [...new Set(cards.map(c => this.getCardRankOrder(c)))].sort((a, b) => a - b);

    if (uniqueRanks.length < 3) {
      return { type: 'Runs', points: 0, combinations: [] };
    }

    const runs: number[][] = [];
    let currentRun: number[] = [uniqueRanks[0]];

    for (let i = 1; i < uniqueRanks.length; i++) {
        if (uniqueRanks[i] === uniqueRanks[i - 1] + 1) {
            currentRun.push(uniqueRanks[i]);
        } else {
            if (currentRun.length >= 3) {
                runs.push(currentRun);
            }
            currentRun = [uniqueRanks[i]];
        }
    }
    if (currentRun.length >= 3) {
        runs.push(currentRun);
    }
    
    const longestRun = runs.reduce((longest, current) => current.length > longest.length ? current : longest, []);

    if (longestRun.length < 3) {
      return { type: 'Runs', points: 0, combinations: [] };
    }

    const rankCounts: { [key: number]: number } = {};
    cards.forEach(card => {
      const rankOrder = this.getCardRankOrder(card);
      rankCounts[rankOrder] = (rankCounts[rankOrder] || 0) + 1;
    });

    let multiplier = 1;
    longestRun.forEach(rank => {
      multiplier *= rankCounts[rank];
    });

    const points = longestRun.length * multiplier;

    const combinations: string[] = [];
    if (points > 0) {
        const cardsByRank: { [key: number]: string[] } = {};
        cards.forEach(card => {
            const rankOrder = this.getCardRankOrder(card);
            if (!cardsByRank[rankOrder]) cardsByRank[rankOrder] = [];
            cardsByRank[rankOrder].push(card);
        });

        const buildRunCombos = (rankIndex: number, currentCombo: string[]) => {
            if (rankIndex === longestRun.length) {
                combinations.push(currentCombo.join(', '));
                return;
            }
            const currentRank = longestRun[rankIndex];
            for (const card of cardsByRank[currentRank]) {
                buildRunCombos(rankIndex + 1, [...currentCombo, card]);
            }
        };
        buildRunCombos(0, []);
    }
    
    return { type: 'Runs', points, combinations };
  }

  private findFlush(hand: string[], starter: string): ScoreBreakdown | null {
    const handSuit = hand[0].slice(-1);
    const handIsFlush = hand.every(c => c.slice(-1) === handSuit);

    if (handIsFlush) {
      const starterSuit = starter.slice(-1);
      if (starterSuit === handSuit) {
        return {
          type: 'Flush',
          points: 5,
          combinations: [[...hand, starter].join(', ')],
        };
      }
      return {
        type: 'Flush',
        points: 4,
        combinations: [hand.join(', ')],
      };
    }
    return null;
  }

  private findNobs(hand: string[], starter: string): ScoreBreakdown | null {
    const starterSuit = starter.slice(-1);
    const jackInHand = hand.find(c => c.slice(0, -1) === 'J' && c.slice(-1) === starterSuit);
    if (jackInHand) {
      return {
        type: 'Nobs',
        points: 1,
        combinations: [jackInHand],
      };
    }
    return null;
  }
}