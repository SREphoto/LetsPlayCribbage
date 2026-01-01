/**
 * Parses a string for special card syntax and replaces it with styled HTML.
 * @param text The input string.
 * @returns A string with card syntax replaced by HTML spans.
 * 
 * Card Syntax: [RankSuit]
 * - Rank: A, 2, 3, 4, 5, 6, 7, 8, 9, T (for 10), J, Q, K
 * - Suit: S (Spades), H (Hearts), D (Diamonds), C (Clubs)
 * Example: "A pair of aces: [AS] [AD]"
 */
export function parseCardsInText(text: string): string {
  // Looks for syntax like [AS] for Ace of Spades or [TC] for 10 of Clubs
  const cardRegex = /\[([A2-9TJQK])([SHDC])\]/g;
  return text.replace(cardRegex, (match, rank, suit) => {
    const suitSymbols: { [key: string]: string } = { S: '♠', H: '♥', D: '♦', C: '♣' };
    const suitColors: { [key: string]: string } = { S: 'text-gray-900', H: 'text-red-600', D: 'text-red-600', C: 'text-gray-900' };
    const rankDisplay = rank === 'T' ? '10' : rank;
    
    return `<span class="inline-block align-baseline bg-white rounded-md border border-gray-500 px-1.5 py-0.5 font-bold shadow-sm mx-0.5" style="font-family: 'Georgia', serif;">
              <span class="${suitColors[suit]}">${rankDisplay}${suitSymbols[suit]}</span>
            </span>`;
  });
}
