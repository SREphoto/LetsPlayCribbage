export const DISCARD_STRATEGY = `
## The Art of the Discard
The discard is your first major strategic decision in any hand of cribbage. Your goal is to maximize your own hand's potential while minimizing the points you give to the crib. This changes dramatically based on whether the crib is yours or your opponent's.

### General Principles
- **Keep 15s:** Cards that make 15 are the backbone of most big hands. Always prioritize keeping combinations like [7H] [8S] or [KH] [5C].
- **Fives are Gold:** The [5S] is the most valuable card in the deck because it combines with any of the four 10-value cards ([TD] [JD] [QD] [KD]) to make 15. A hand with a 5 is already promising.
- **Pairs are Powerful:** Keeping a pair like [7H] [7D] is always a good start. It's an easy 2 points and a great foundation for a larger score if another 7 or an 8 appears.
- **Connecting Cards:** Cards that are close in rank, like [2S] [3H] or [JC] [QH], are good to keep as they have a high chance of becoming a run.

### 2-Player Game: Head-to-Head Tactics
This is where discard strategy is most critical, as you have full control over what goes into the opponent's crib.

#### When it's YOUR Crib (Offensive Discarding)
Your goal is to "salt the mine." You want to throw cards that have a high potential to score.
- **Toss Fives:** A pair of 5s ([5H] [5D]) is one of the best possible discards to your own crib.
- **Toss Pairs:** Any low pair, like [2S] [2C], is a great choice.
- **Toss Connectors:** Cards like [7S] [8D] or [3C] [4C] can easily turn into runs in the crib.
- **Example:** You are dealt [5H] [5S] [6C] [7D] [KH] [AC]. A great play is to keep [5S] [6C] [7D] [KH] (potential for 15s and a run) and throw [5H] [AC] to your crib. The 5 is powerful, and the Ace can help make 15.

#### When it's your OPPONENT'S Crib (Defensive Discarding)
Your goal is to give them "duds" – cards that are unlikely to score well together.
- **Split Ranks:** Throw cards that are far apart in rank, like a [2S] and a [9H]. These are unlikely to form a run.
- **Avoid Fives:** Never, ever throw a 5 into your opponent's crib if you can help it.
- **Break up Pairs:** If you have to throw a card that matches one already in your hand, it's often better to keep the pair yourself.
- **Top and Bottom:** A common defensive discard is the highest and lowest card you can spare, such as [KC] and [AC].
- **Example:** You are dealt [3H] [4S] [5C] [JH] [QC] [KS]. This is a fantastic hand. Keep [3H] [4S] [5C] [JH] for a guaranteed run and 15. Discard the [QC] and [KS] to your opponent. These are unlikely to help each other unless a Jack or Ten appears.

### 3 & 4-Player Games: The Chaos Factor
In these games, you only discard one card. The crib gets a card from every player, making it highly unpredictable.
- **Focus on Your Hand:** Your primary goal should almost always be to maximize your own hand's score. The chances of you successfully "spoiling" a crib that gets cards from 2 or 3 other players are very low.
- **The Only Exception:** If your hand is terrible and you have no clear path to a good score, you might play defensively and throw your least useful card, like a King if you have no 5s. But this is rare.
- **General Rule:** From your 5-card hand, find the best 4-card combination for yourself and discard the leftover card, regardless of who owns the crib.
`;

export const PEGGING_STRATEGY = `
## The Art of Pegging
Pegging is where games are often won or lost. A few extra points here and there add up quickly. The key is to anticipate your opponent's plays and set traps.

### General Principles
- **Avoid 21:** Try not to play a card that makes the count 21. Your opponent can easily play any 10-value card to make 31 for 2 points.
- **Lead Low:** When you are the first to play, leading with a low card (4 or less) is often safest. This prevents your opponent from immediately scoring a 15.
- **The Magic 26:** If the count is 26, 27, or 28, and you hold a card that can bring it to 31, play it. This is a common way to score 2 points.

### 2-Player Game: The Tactical Duel

#### When Leading (Non-Dealer)
- **Lead from a Pair:** If you have a pair like [7H] [7D], leading one of them is a great strategy. If your opponent also plays a 7 (making a pair for 2), you can play your second 7 for a "pair royal" (trips) and 6 points!
- **The "Sum of 5" Lead:** Leading a card where you also hold its counterpart to make 5 (e.g., lead a [2S] when you also have a [3H]) can be a subtle trap.
- **Don't Lead a 5:** Leading a 5 is risky. Your opponent can play any 10-value card for an easy 15 for 2.

#### When Responding (Dealer)
- **Try for 15:** Always be looking to make the count 15. If the opponent leads a 7, and you have an 8, play it for 2 points.
- **Pairing:** If the opponent leads a card you can match, it's often worth taking the 2 points for a pair.
- **Trapping with "Go":** If the count is high (e.g., 25) and you hold a low card like an Ace, but your opponent plays a high card and says "Go," you can often play your Ace, score 1 for the Go, and then potentially play another card if the new count allows.

### 3 & 4-Player Games: Board Awareness
With more players, pegging becomes less about setting up multi-turn traps and more about capitalizing on immediate opportunities.
- **Points Over Position:** Take points when you can get them. Don't hold onto a pair hoping to make trips three turns from now; the board state will change too quickly. The player after you might make the count 31 before it even gets back to you.
- **Watch the Cards:** Keep track of what's been played. If three Kings have already been played and you have the fourth, it's a very safe card to play without fear of being paired.
- **The "Go" is Communal:** In a 4-player game, if one player says "Go," the next three players may still be able to play cards. The point for the "Go" is only awarded after everyone has had a chance to play. This makes aggressive plays to get a "Go" point less reliable.
`;
