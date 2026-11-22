"""Subtitle export for the silent 15-second test: writes an empty cue list."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
json.dump([], open(os.path.join(HERE, "out", "cues.json"), "w"), indent=1)
