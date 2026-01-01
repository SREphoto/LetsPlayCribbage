import { QuizData } from './interactive-quiz.component';

export type RuleContent = 
  | { type: 'h2'; content: string }
  | { type: 'p'; content: string }
  | { type: 'quiz'; data: QuizData };

export const RULES_2_PLAYERS: RuleContent[] = [
  { type: 'h2', content: 'The Goal' },
  { type: 'p', content: 'The main objective in cribbage is to be the first player to score <span class="text-yellow-300 font-bold">121 points</span>. You do this by creating specific card combinations during two phases of the game: "pegging" (playing cards) and "scoring the hand" (evaluating your cards at the end of a round).' },
  { type: 'p', content: '<b>Card Values:</b> For scoring purposes, Aces are worth 1 point, Face cards (J, Q, K) are worth 10 points, and all other cards are their face value.' },
  { type: 'h2', content: 'The Deal' },
  { type: 'p', content: '<b>Setup:</b> You\'ll need a standard 52-card deck and a way to keep score.' },
  { type: 'p', content: '<b>First Dealer:</b> Each player cuts the deck. The player with the lowest card (Ace is low) deals first.' },
  { type: 'p', content: '<b>The Deal:</b> The dealer shuffles, the non-dealer cuts, and the dealer deals 6 cards to each player.' },
  { type: 'h2', content: 'The Crib' },
  { type: 'p', content: 'Each player looks at their 6 cards and discards 2 cards, face down, to form the "crib". The crib belongs to the dealer and is scored after the hands.' },
  { type: 'h2', content: 'The Play (Pegging)' },
  { type: 'p', content: 'This phase is where you score points by playing cards.' },
  { type: 'p', content: '<b>The Starter Card:</b> The non-dealer cuts the remaining deck. The dealer turns over the top card. This is the "starter". If it\'s a Jack, the dealer immediately scores <span class="text-yellow-300 font-bold">2 points</span> for "His Heels".' },
  { type: 'p', content: '<b>Playing Cards:</b> The non-dealer plays first. Players alternate playing one card, announcing the running total. The total cannot exceed 31.' },
  { type: 'p', content: '<b>Scoring During Pegging:</b>' },
  { type: 'p', content: '<b>15:</b> Score <span class="text-yellow-300 font-bold">2 points</span> for making the total exactly 15.' },
  { type: 'p', content: '<b>Pair:</b> Score <span class="text-yellow-300 font-bold">2 points</span> for matching the previous card (e.g., [7H] then [7C]).' },
  { type: 'p', content: '<b>Trips:</b> Score <span class="text-yellow-300 font-bold">6 points</span> for a third matching card (e.g., [7H], [7C], then [7D]).' },
  { type: 'p', content: '<b>Quads:</b> Score <span class="text-yellow-300 font-bold">12 points</span> for a fourth matching card (e.g., [7H], [7C], [7D], then [7S]).' },
  { type: 'p', content: '<b>Run (Straight):</b> Score <span class="text-yellow-300 font-bold">1 point per card</span> for a run of 3 or more (e.g., [4H], [5C], [6D]). The cards do not need to be the same suit.' },
  { type: 'p', content: '<b>"Go":</b> If a player cannot play without exceeding 31, they say "Go." The other player scores <span class="text-yellow-300 font-bold">1 point</span> and continues playing if able.' },
  { type: 'p', content: '<b>Last Card:</b> The player who plays the very last card scores <span class="text-yellow-300 font-bold">1 point</span>.' },
  { type: 'h2', content: 'Scoring the Hand' },
  { type: 'p', content: 'After pegging, hands are scored.' },
  { type: 'p', content: '<b>Scoring Order:</b> Non-dealer\'s hand, then dealer\'s hand, then the dealer\'s crib.' },
  { type: 'p', content: '<b>How to Score:</b> Combine your 4 hand cards with the 5th starter card to make combinations.' },
  { type: 'p', content: '<b>15s:</b> Score <span class="text-yellow-300 font-bold">2 points</span> for each combination that totals 15 (e.g., [8S] + [7H] or [KH] + [5D]).' },
  {
    type: 'quiz',
    data: {
      question: 'Test your knowledge: How many points for 15s are in this hand?',
      hand: ['5H', '5D', '5S', 'JC'],
      starter: '5C',
      options: [
        { text: '8 points', isCorrect: false },
        { text: '12 points', isCorrect: false },
        { text: '16 points', isCorrect: true },
        { text: '20 points', isCorrect: false }
      ]
    }
  },
  { type: 'p', content: '<b>Pairs:</b> <span class="text-yellow-300 font-bold">2 points</span> for a pair ([KH] [KD]), <span class="text-yellow-300 font-bold">6</span> for three of a kind ([9S] [9C] [9H]), <span class="text-yellow-300 font-bold">12</span> for four of a kind ([5S] [5C] [5H] [5D]).' },
  { type: 'p', content: '<b>Runs:</b> <span class="text-yellow-300 font-bold">1 point per card</span> for runs of 3 or more (e.g., [2S] [3H] [4D]).' },
  { type: 'p', content: '<b>Flush:</b> <span class="text-yellow-300 font-bold">4 points</span> if all 4 hand cards are the same suit (e.g., [2H] [5H] [9H] [JH]), <span class="text-yellow-300 font-bold">5 points</span> if the starter matches.' },
  { type: 'p', content: '<b>Crib Flush Rule:</b> A flush in the crib only scores if all 5 cards (crib + starter) are the same suit.' },
  { type: 'p', content: '<b>His Nobs:</b> <span class="text-yellow-300 font-bold">1 point</span> for a Jack in hand of the same suit as the starter (e.g., hand has [JC] and starter is [4C]).' },
  {
    type: 'quiz',
    data: {
      question: 'Quiz time: Calculate the total score for this hand.',
      hand: ['7S', '7D', '8C', '9H'],
      starter: 'AS',
      options: [
        { text: '8 points', isCorrect: false },
        { text: '10 points', isCorrect: true },
        { text: '12 points', isCorrect: false },
        { text: '14 points', isCorrect: false }
      ]
    }
  },
  { type: 'h2', content: 'Winning the Game' },
  { type: 'p', content: 'The first player to reach or exceed <span class="text-yellow-300 font-bold">121 points</span> wins!' },
];

export const RULES_3_PLAYERS: RuleContent[] = [
  { type: 'h2', content: 'The Goal' },
  { type: 'p', content: 'The main objective in cribbage is to be the first player to score <span class="text-yellow-300 font-bold">121 points</span>. You do this by creating specific card combinations during two phases of the game: "pegging" (playing cards) and "scoring the hand" (evaluating your cards at the end of a round).' },
  { type: 'p', content: '<b>Card Values:</b> For scoring purposes, Aces are worth 1 point, Face cards (J, Q, K) are worth 10 points, and all other cards are their face value.' },
  { type: 'h2', content: 'The Deal' },
  { type: 'p', content: 'A standard 52-card deck is used. The deal rotates clockwise each round.' },
  { type: 'p', content: 'The dealer deals 5 cards to each player, and one card face-down to start the crib. Each player then discards one card to the crib. This leaves each player with a 4-card hand, and the crib with 4 cards.' },
  { type: 'h2', content: 'The Crib' },
  { type: 'p', content: 'The crib belongs to the dealer. When discarding, the dealer tries to improve the crib, while non-dealers try to give it "bad" cards.' },
  { type: 'h2', content: 'The Starter Card' },
  { type: 'p', content: 'After the discard, the player to the dealer\'s left cuts the deck and the dealer turns over the starter card. If it\'s a Jack, the dealer scores <span class="text-yellow-300 font-bold">2 points</span> ("2 for his heels").' },
  { type: 'h2', content: 'The Play (Pegging)' },
  { type: 'p', content: 'Players score by playing cards in sequence. The total count cannot exceed 31.' },
  { type: 'p', content: '<b>Scoring during The Play:</b>' },
  { type: 'p', content: '<b>15:</b> Score <span class="text-yellow-300 font-bold">2 points</span> for making the total exactly 15.' },
  { type: 'p', content: '<b>Pairs:</b> Score <span class="text-yellow-300 font-bold">2 points</span> for a pair (e.g., [QH] then [QC]), <span class="text-yellow-300 font-bold">6</span> for three of a kind, <span class="text-yellow-300 font-bold">12</span> for four of a kind.' },
  { type: 'p', content: '<b>Runs:</b> Score <span class="text-yellow-300 font-bold">1 point per card</span> for a run of 3 or more (e.g., [9S] [TD] [JH]).' },
  { type: 'p', content: '<b>"Go":</b> If a player cannot play, they call "Go." Play continues until no one can play. The last person to play a card gets <span class="text-yellow-300 font-bold">1 point</span>. If the card makes the total 31, they get <span class="text-yellow-300 font-bold">2 points</span> instead.' },
  { type: 'h2', content: 'Scoring the Hand' },
  { type: 'p', content: 'After pegging, players score their hands with the starter card.' },
  { type: 'p', content: '<b>Scoring combinations:</b>' },
  { type: 'p', content: '<b>15:</b> <span class="text-yellow-300 font-bold">2 points</span> for each card combination totaling 15 (e.g., [6C] + [9D]).' },
  { type: 'p', content: '<b>Pairs:</b> <span class="text-yellow-300 font-bold">2, 6, or 12 points</span> for pairs ([AD] [AS]), three, or four of a kind.' },
  { type: 'p', content: '<b>Runs:</b> <span class="text-yellow-300 font-bold">1 point per card</span> for a sequence of 3+ (e.g., [JS] [QH] [KC]).' },
  { type: 'p', content: '<b>Flush:</b> <span class="text-yellow-300 font-bold">4 points</span> for 4 hand cards of the same suit (e.g., [3D] [7D] [TD] [QD]). <span class="text-yellow-300 font-bold">5 points</span> if the starter matches.' },
  { type: 'p', content: '<b>Crib Flush Rule:</b> All 5 cards must be the same suit for <span class="text-yellow-300 font-bold">5 points</span>.' },
  { type: 'p', content: '<b>His Nobs:</b> <span class="text-yellow-300 font-bold">1 point</span> for a Jack in hand with the same suit as the starter (e.g., hand has [JS] and starter is [AS]).' },
  { type: 'p', content: '<b>Scoring Order:</b> Player to dealer\'s left, next player, dealer\'s hand, then dealer\'s crib.' },
  { type: 'h2', content: 'Winning the Game' },
  { type: 'p', content: 'The first player to reach or exceed <span class="text-yellow-300 font-bold">121 points</span> wins.' }
];

export const RULES_4_PLAYERS: RuleContent[] = [
  { type: 'h2', content: 'The Goal' },
  { type: 'p', content: 'This is a partnership game (2 vs 2). The main objective is for your team to be the first to score <span class="text-yellow-300 font-bold">121 points</span>. Partners sit opposite each other and combine their scores. You score by creating specific card combinations during two phases: "pegging" (playing cards) and "scoring the hand" (evaluating your cards at the end of a round).' },
  { type: 'p', content: '<b>Card Values:</b> For scoring purposes, Aces are worth 1 point, Face cards (J, Q, K) are worth 10 points, and all other cards are their face value.' },
  { type: 'h2', content: 'The Deal' },
  { type: 'p', content: 'The dealer deals 5 cards to each player. Each player then discards one card to the dealer\'s crib. Every player is left with a 4-card hand.' },
  { type: 'h2', content: 'The Crib' },
  { type: 'p', content: 'The crib contains one card from each player and belongs to the dealer\'s team.' },
  { type: 'h2', content: 'The Starter Card' },
  { type: 'p', content: 'The player to the dealer\'s right cuts the deck for the starter card. If a Jack is cut, the dealer\'s team immediately scores <span class="text-yellow-300 font-bold">2 points</span> ("Two for His Heels").' },
  { type: 'h2', content: 'The Play (Pegging)' },
  { type: 'p', content: 'Players take turns playing cards, adding to a count that cannot exceed 31.' },
  { type: 'p', content: '<b>Scoring During Play:</b>' },
  { type: 'p', content: '<b>15:</b> Making the total 15 scores <span class="text-yellow-300 font-bold">2 points</span>.' },
  { type: 'p', content: '<b>31:</b> Making the total 31 scores <span class="text-yellow-300 font-bold">2 points</span>.' },
  { type: 'p', content: '<b>Pairs/Triples/Quads:</b> A pair (e.g., [8S] [8H]) scores <span class="text-yellow-300 font-bold">2</span>, three of a kind scores <span class="text-yellow-300 font-bold">6</span>, four of a kind scores <span class="text-yellow-300 font-bold">12</span>.' },
  { type: 'p', content: '<b>Runs:</b> A sequence of three or more cards (e.g., [JS] [QH] [KC]) scores <span class="text-yellow-300 font-bold">1 point per card</span>.' },
  { type: 'p', content: '<b>"Go":</b> If you cannot play, say "Go." The last player to lay a card scores <span class="text-yellow-300 font-bold">1 point</span>.' },
  { type: 'h2', content: 'Scoring the Hand' },
  { type: 'p', content: 'Hands are scored with the starter card.' },
  { type: 'p', content: '<b>Order of Scoring:</b> Begins with the player to the dealer\'s left, proceeds clockwise, and ends with the dealer scoring their hand, then the crib. All points are added to the team\'s total.' },
  { type: 'p', content: '<b>Combinations:</b>' },
  { type: 'p', content: '<b>15s:</b> Any combination of cards adding to 15 (e.g., [AH] + [4S] + [TC]) scores <span class="text-yellow-300 font-bold">2 points</span>.' },
  { type: 'p', content: '<b>Pairs:</b> A pair scores <span class="text-yellow-300 font-bold">2 points</span> (e.g., [6C] [6H]).' },
  { type: 'p', content: '<b>Runs:</b> A run of 3+ cards (e.g., [8S] [9D] [TC]) scores <span class="text-yellow-300 font-bold">1 point per card</span>.' },
  { type: 'p', content: '<b>Flush:</b> <span class="text-yellow-300 font-bold">4 points</span> for 4 hand cards of the same suit (e.g., all Spades: [2S] [6S] [9S] [JS]). <span class="text-yellow-300 font-bold">5 points</span> if the starter matches.' },
  { type: 'p', content: '<b>Crib Flush Rule:</b> All 5 cards must be the same suit for <span class="text-yellow-300 font-bold">5 points</span>.' },
  { type: 'p', content: '<b>"His Nobs":</b> A Jack in hand of the same suit as the starter (e.g., hand has [JD] and starter is [5D]) scores <span class="text-yellow-300 font-bold">1 point</span>.' },
  { type: 'h2', content: 'Winning the Game' },
  { type: 'p', content: 'The first partnership to reach or exceed <span class="text-yellow-300 font-bold">121 points</span> wins!' }
];
