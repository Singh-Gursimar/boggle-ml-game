"""
generate_dataset.py

CS480: Machine Learning Architecture Pipeline
Generates synthetic text-discovery data and fits Logistic Regression boundaries 
to parameterize difficulty behavior in our board-game constraint-space.
"""
import argparse
import json
import logging
import random
from pathlib import Path
from typing import Dict, Tuple

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from wordfreq import zipf_frequency

# Setup logging explicitly for clean terminal streams
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

# Standardized heuristic values for feature scaling
SCRABBLE_VALUES: Dict[str, int] = {
    'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2, 'h': 4, 'i': 1, 
    'j': 8, 'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1, 
    's': 1, 't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10
}

def extract_features(word: str) -> Tuple[int, int, float]:
    """
    Extract deterministic features from a standard string sequence.
    """
    word = word.lower()
    length = len(word)
    score = sum(SCRABBLE_VALUES.get(c, 0) for c in word)
    
    # Zipf frequency defines how common a word is (log-scale). 1=rare, 8=ubiquitous.
    freq = zipf_frequency(word, 'en') 
    return length, score, freq

def simulate_ground_truth(difficulty: str, length: int, score: int, freq: float) -> float:
    """
    Acts as our deterministic Oracle distribution. Computes the probability that a human
    of `difficulty` skill level would identify the string given its features.
    """
    base_probability = 0.0
    
    if difficulty == 'easy':
        # Over-indexes on common vernacular, penalizes large spatial sequences.
        base_probability = (freq / 8.0) * 0.8 - (length * 0.05)
    elif difficulty == 'medium':
        # Balanced linear heuristic structure.
        base_probability = (freq / 8.0) * 0.5 + (length * 0.05)
    elif difficulty == 'hard':
        # Over-indexes on obscure vocabulary vectors and complex patterns.
        base_probability = ((8.0 - freq) / 8.0) * 0.3 + (length * 0.1) + (score * 0.02)
    
    # Introduce stochastic Gaussian noise to avoid overfitting to pure linear mapping
    noise = random.uniform(-0.1, 0.1)
    return float(np.clip(base_probability + noise, 0.01, 0.99))

def train_and_export_pipeline(samples: int, output_dir: Path) -> None:
    """
    End-to-End data ingestion, regression modeling, and topology export pipeline.
    """
    # Expanded deterministic subset for varied distributional sampling
    corpus: list[str] = [
        "cat", "dog", "hello", "quixotic", "abundant", "the", "zit", "zephyr", 
        "apple", "machine", "learning", "data", "science", "python", "react", 
        "board", "game", "intelligence", "artificial", "algorithm", "student",
        "university", "project", "assignment", "complex", "efficiency"
    ]
    
    logging.info(f"Initiating synthetic DataFrame generation... (N={samples})")
    
    data = []
    for _ in range(samples):
        target_word = random.choice(corpus)
        w_len, w_score, w_freq = extract_features(target_word)
        
        for diff_tier in ['easy', 'medium', 'hard']:
            prob = simulate_ground_truth(diff_tier, w_len, w_score, w_freq)
            
            # Threshold classification rule (Ground Truth Event)
            y_target = 1 if random.random() < prob else 0
            
            data.append({
                'word': target_word,
                'length': w_len,
                'scrabble_score': w_score,
                'zipf_freq': w_freq,
                'difficulty': diff_tier,
                'found': y_target
            })
            
    df = pd.DataFrame(data)
    csv_path = Path('boggle_ml_dataset.csv')
    df.to_csv(csv_path, index=False)
    logging.info(f"Generated target distributions successfully written to {csv_path.absolute()}")

    logging.info("Fitting LogisticRegression multi-class architectural constraints...")
    weights: Dict[str, Dict[str, float]] = {}
    
    for diff_tier in ['easy', 'medium', 'hard']:
        subframe = df[df['difficulty'] == diff_tier]
        X = subframe[['length', 'scrabble_score', 'zipf_freq']]
        y = subframe['found']
        
        # Fit generalized linear model against un-regularized parameters 
        clf = LogisticRegression(penalty=None, solver='lbfgs') 
        clf.fit(X, y)
        
        weights[diff_tier] = {
            "bias": float(clf.intercept_[0]),
            "length": float(clf.coef_[0][0]),
            "score": float(clf.coef_[0][1]),
            "freq": float(clf.coef_[0][2])
        }
        logging.info(f"Converged {diff_tier.upper()} subset optimization iterations complete.")

    out_file = output_dir / 'ml_weights.json'
    with open(out_file, 'w') as f:
        json.dump(weights, f, indent=2)
    logging.info(f"Core parameterizations successfully exported to {out_file.absolute()}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Adversarial ML Generation Pipeline Tool")
    parser.add_argument("--samples", type=int, default=10000, help="Volume of Monte Carlo epochs generated.")
    parser.add_argument("--outdir", type=str, default="public", help="Target output dir for deployment weights.")
    args = parser.parse_args()
    
    output_target = Path(args.outdir)
    output_target.mkdir(parents=True, exist_ok=True)
    
    train_and_export_pipeline(samples=args.samples, output_dir=output_target)
