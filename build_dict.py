import json
from wordfreq import top_n_list, zipf_frequency

print("Fetching words...")
words = top_n_list('en', 100000)
valid_words = [w for w in words if w.isalpha() and len(w) >= 3 and len(w) <= 25]

dictionary = {w.upper(): round(zipf_frequency(w, 'en'), 2) for w in valid_words}

with open('public/dictionary.json', 'w') as f:
    json.dump(dictionary, f)
print(f"Built dictionary with {len(dictionary)} words.")
