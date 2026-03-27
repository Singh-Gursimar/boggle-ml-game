export const SCRABBLE_VALUES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, 
  l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, 
  v: 4, w: 4, x: 8, y: 4, z: 10
};

/**
 * Classic 5x5 Boggle (Big Boggle) dice configurations.
 * Using standard distributions yields more realistic English boards.
 */
export const BOGGLE_DICE_5X5 = [
  "AAAFRS", "AAEEEE", "AAFIRS", "ADENNN", "AEEEEM",
  "AEEGMU", "AEGMNN", "AFIRSY", "BJKQXZ", "CCNSTW",
  "CEIILT", "CEILPT", "CEIPST", "DDLNOR", "DHHLOR",
  "DHHNOT", "DHLNOR", "EIIITT", "EMOTTT", "ENSSSU",
  "FIPRSY", "GORRVW", "HIPRRY", "NOOTUW", "OOOTTU"
];

/**
 * Calculates the score of a validated word.
 * Scrabble letter values with an advanced length bonus multiplier.
 * 
 * @param word The valid string to score
 * @returns integer score
 */
export const calculateScore = (word: string): number => {
  const normalized = word.toLowerCase();
  const baseScore = normalized.split('').reduce((acc, char) => acc + (SCRABBLE_VALUES[char] || 0), 0);
  const lengthBonus = normalized.length > 4 ? (normalized.length - 4) * 3 : 0;
  return baseScore + lengthBonus;
};

/**
 * Sigmoid activation function for Logistic Regression inference.
 * Maps any real value z to a probability subset between (0, 1).
 */
export const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z));

/**
 * Generates a 5x5 board simulating physical Boggle dice rolls.
 */
export const generateBoard = (): string[][] => {
  const shuffledDice = [...BOGGLE_DICE_5X5];
  for (let i = shuffledDice.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDice[i], shuffledDice[j]] = [shuffledDice[j], shuffledDice[i]];
  }
  
  const board: string[][] = [];
  let dieIndex = 0;
  
  for (let row = 0; row < 5; row++) {
    const currentRow: string[] = [];
    for (let col = 0; col < 5; col++) {
      const die = shuffledDice[dieIndex];
      // Pick a random face from the selected die
      const face = die[Math.floor(Math.random() * die.length)];
      currentRow.push(face === 'Q' ? 'Qu' : face);
      dieIndex++;
    }
    board.push(currentRow);
  }
  return board;
};

export class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord: boolean = false;
  zipfFreq: number = 0;
}

export class Trie {
  root: TrieNode = new TrieNode();

  insert(word: string, freq: number) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.zipfFreq = freq;
  }
}

/**
 * Solves the Boggle board to find all available dictionary words.
 * Uses Depth First Search combined with Trie pruning.
 */
export const solveBoard = (board: string[][], dictionary: Record<string, number>): Record<string, number> => {
  if (board.length === 0 || board[0].length === 0) {
    return {};
  }

  const trie = new Trie();
  for (const [word, freq] of Object.entries(dictionary)) {
    if (word.length >= 3 && word.length <= 25) {
      trie.insert(word.toUpperCase(), Number.isFinite(freq) ? freq : 0);
    }
  }

  const rows = board.length;
  const cols = board[0].length;
  const foundWords: Record<string, number> = {};
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const dfs = (r: number, c: number, node: TrieNode, path: string) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || visited[r][c]) return;

    const cell = board[r][c].toUpperCase();
    let currNode: TrieNode | undefined = node;

    // Handle "QU"
    for (let i = 0; i < cell.length; i++) {
      if (!currNode) return; // Pruned
      currNode = currNode.children[cell[i]];
    }
    if (!currNode) return; // Final check after loop

    const newPath = path + cell;

    if (currNode.isEndOfWord && newPath.length >= 3) {
      foundWords[newPath.toLowerCase()] = currNode.zipfFreq;
    }

    visited[r][c] = true;
    
    // 8 directions
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) {
          dfs(r + dr, c + dc, currNode, newPath);
        }
      }
    }

    visited[r][c] = false;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, trie.root, "");
    }
  }

  return foundWords;
};
