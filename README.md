# Boggle vs AI 🎮

A production-ready, machine learning-powered Boggle word game where you compete against an AI opponent. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Machine Learning AI Opponent**: Three difficulty levels (easy, medium, hard) powered by logistic regression models
- **Real-time Gameplay**: Turn-based word-finding game with instant validation
- **Depth-First Search Solver**: Efficient board solving using Trie data structure
- **Modern UI/UX**: Minimalist design with smooth animations and loading states
- **Production-Ready**: Error boundaries, logging, validation, and optimizations
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript**: 100% type-safe with strict mode enabled

## 🎯 How to Play

1. Find words on the 5×5 Boggle board by connecting adjacent letters
2. Words must be at least 3 letters long
3. Type your word and press "Play" or click the board letters
4. The AI will respond with its own word
5. Continue taking turns until no words remain
6. Score is calculated using Scrabble letter values plus length bonuses

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd boggle-ml-game

# Install dependencies
npm install

# Build the dictionary (if needed)
npm run dict:build

# Train ML models (optional - pre-trained models included)
npm run ml:train
```

## 🛠️ Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## 🏗️ Building for Production

```bash
# Run type checking
npm run typecheck

# Build the project
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
boggle-ml-game/
├── app/
│   ├── components/
│   │   ├── GameBoard.tsx       # Main game component
│   │   ├── ErrorBoundary.tsx   # Error handling wrapper
│   │   └── LoadingSkeleton.tsx # Loading UI
│   ├── utils/
│   │   ├── gameLogic.ts        # Core game logic & DFS solver
│   │   ├── validation.ts       # Runtime data validation
│   │   └── logger.ts           # Structured logging
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles & animations
├── ml/
│   └── generate_dataset.py     # ML model training script
├── public/
│   ├── dictionary.json         # 100k+ words with frequencies
│   └── ml_weights.json         # Trained AI models
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies & scripts
```

## 🤖 AI Implementation

The AI uses logistic regression models trained on word features:

- **Word length**: Number of characters
- **Score value**: Scrabble-style letter values
- **Word frequency**: Zipf frequency from corpus analysis
- **Difficulty levels**: Different model weights for easy/medium/hard

### Training Your Own Models

```bash
# Generate new training data and models
npm run ml:train

# This creates:
# - Training dataset with 10,000 samples
# - Three logistic regression models
# - Saves to public/ml_weights.json
```

## 🔧 Configuration

### Next.js Config (`next.config.js`)

- **Compression**: Enabled for smaller bundle sizes
- **Console removal**: Removes console.log in production (keeps errors/warnings)
- **Static asset caching**: Aggressive caching for JSON files

### TypeScript Config (`tsconfig.json`)

- **Strict mode**: Full type safety enabled
- **Module resolution**: Bundler mode for Next.js compatibility

## 🎨 Styling

- **Tailwind CSS 4.2**: Utility-first CSS framework
- **Custom animations**: Word appearance, score pulse effects
- **Responsive design**: Mobile-first approach
- **Minimalist aesthetic**: Clean, focused user interface

## 🛡️ Production Features

### Error Handling
- React Error Boundary for graceful failure recovery
- Retry mechanism for failed asset loads
- Structured error logging with context

### Performance
- React.useMemo for expensive calculations
- React.useCallback for stable function references
- Lazy loading and code splitting
- Optimized re-renders with dependency arrays

### Validation
- Runtime validation of JSON data structures
- Type-safe API with TypeScript
- Input sanitization and validation

### Monitoring
- Structured logging system
- Analytics event tracking hooks
- Error tracking preparation

## 📊 Technical Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.1 | React framework |
| React | 19.2.4 | UI library |
| TypeScript | 6.0.2 | Type safety |
| Tailwind CSS | 4.2.2 | Styling |
| Python | 3.x | ML training |
| scikit-learn | - | ML models |

## 🚢 Deployment

The app is production-ready and can be deployed to:

- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **Docker**: Container deployment
- **Node.js**: Traditional hosting

```bash
# Build for production
npm run build

# The output is in .next/ directory
# Static assets are in public/
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run typecheck` | Run TypeScript checks |
| `npm run check` | Type check + build |
| `npm run dict:build` | Generate dictionary.json |
| `npm run ml:train` | Train ML models |

## 🧪 Testing Checklist

- [x] TypeScript compilation (zero errors)
- [x] Production build (successful)
- [x] Error boundary catches errors
- [x] Loading states display correctly
- [x] Asset validation works
- [x] Retry mechanism functions
- [x] All three difficulty levels work
- [x] Mobile responsive design
- [x] Animations smooth
- [x] No console errors

## 🐛 Known Issues

None! All critical bugs have been fixed.

## 📈 Future Enhancements

- [ ] Add unit tests with Jest/Vitest
- [ ] Add E2E tests with Playwright
- [ ] Implement score persistence (localStorage)
- [ ] Add game history tracking
- [ ] Implement multiplayer mode
- [ ] Add sound effects
- [ ] Create progressive web app (PWA)
- [ ] Add more board sizes (4×4, 6×6)
- [ ] Implement timed mode

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and Machine Learning**
