# Boggle vs AI

A machine learning-powered Boggle word game where you compete against an AI opponent.

**Live Demo:** https://boggle-ml-game.vercel.app

## Features

- Three AI difficulty levels (easy, medium, hard) using logistic regression
- Turn-based gameplay with instant word validation
- DFS solver with Trie data structure for efficient board solving
- 100k+ word dictionary with frequency data
- Responsive design for desktop and mobile

## How to Play

1. Find words on the 5×5 board by connecting adjacent letters
2. Words must be at least 3 letters long
3. Type your word and press "Play"
4. The AI responds with its own word
5. Continue until no words remain
6. Score uses Scrabble letter values plus length bonuses

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── components/     # React components (GameBoard, ErrorBoundary, LoadingSkeleton)
├── utils/          # Game logic, validation, logging
├── layout.tsx      # Root layout
├── page.tsx        # Home page
└── globals.css     # Styles

ml/                 # Python ML training scripts
public/             # Dictionary and ML weights
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run typecheck` | TypeScript checks |
| `npm run ml:train` | Train ML models |
| `npm run dict:build` | Generate dictionary |

## Tech Stack

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4
- Python + scikit-learn (ML training)

## License

MIT
