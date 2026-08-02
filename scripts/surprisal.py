#!/usr/bin/env python3
"""
Per-slide surprisal scoring for Percept.

Reads a PDF (already produced by the convert pipeline), extracts text per page
with pdftotext, and computes GPT-2 surprisal for each page.

Usage:
    python3 scripts/surprisal.py deck.pdf
    python3 scripts/surprisal.py deck.pdf --pretty
    echo "some slide text" | python3 scripts/surprisal.py --stdin

Output: JSON on stdout.
"""

import argparse
import json
import math
import os
import subprocess
import sys

os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
os.environ.setdefault("TRANSFORMERS_VERBOSITY", "error")

MODEL_NAME = "gpt2"
MAX_TOKENS = 1024


def extract_pages(pdf_path):
    """Return a list of page texts using pdftotext. Pages split on form feed."""
    if not os.path.isfile(pdf_path):
        raise FileNotFoundError(pdf_path)

    result = subprocess.run(
        ["pdftotext", "-layout", pdf_path, "-"],
        capture_output=True,
        text=True,
        check=True,
    )
    pages = result.stdout.split("\f")
    # pdftotext emits a trailing form feed, so the last chunk is usually empty.
    if pages and not pages[-1].strip():
        pages.pop()
    return pages


def normalise(text):
    """Collapse pdftotext layout padding into normal prose spacing."""
    lines = [" ".join(line.split()) for line in text.splitlines()]
    return "\n".join(line for line in lines if line).strip()


def load_model():
    import torch
    from transformers import GPT2LMHeadModel, GPT2TokenizerFast

    tokenizer = GPT2TokenizerFast.from_pretrained(MODEL_NAME)
    model = GPT2LMHeadModel.from_pretrained(MODEL_NAME)
    model.eval()
    torch.set_grad_enabled(False)
    return torch, tokenizer, model


def score_text(torch, tokenizer, model, text):
    """Return surprisal statistics for one slide's text, in bits."""
    clean = normalise(text)
    if not clean:
        return {
            "tokenCount": 0,
            "wordCount": 0,
            "meanSurprisal": None,
            "totalSurprisal": 0.0,
            "maxSurprisal": None,
            "empty": True,
        }

    # Prepend an <|endoftext|> so the first real token also gets a prediction.
    bos = tokenizer.eos_token_id
    ids = [bos] + tokenizer.encode(clean)[: MAX_TOKENS - 1]
    tensor = torch.tensor([ids])

    logits = model(tensor).logits
    log_probs = torch.log_softmax(logits[0, :-1], dim=-1)
    targets = tensor[0, 1:]
    token_logprobs = log_probs[range(len(targets)), targets]

    # Convert natural log to bits.
    surprisals = (-token_logprobs / math.log(2)).tolist()

    return {
        "tokenCount": len(surprisals),
        "wordCount": len(clean.split()),
        "meanSurprisal": round(sum(surprisals) / len(surprisals), 4),
        "totalSurprisal": round(sum(surprisals), 2),
        "maxSurprisal": round(max(surprisals), 4),
        "empty": False,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", nargs="?", help="Path to the converted PDF")
    parser.add_argument("--stdin", action="store_true", help="Score raw text from stdin")
    parser.add_argument("--pretty", action="store_true", help="Indent the JSON output")
    args = parser.parse_args()

    torch, tokenizer, model = load_model()

    if args.stdin:
        payload = {"slides": [dict(index=0, **score_text(torch, tokenizer, model, sys.stdin.read()))]}
    else:
        if not args.pdf:
            parser.error("provide a PDF path or use --stdin")
        pages = extract_pages(args.pdf)
        payload = {
            "slides": [
                dict(index=i, **score_text(torch, tokenizer, model, page))
                for i, page in enumerate(pages)
            ]
        }

    payload["model"] = MODEL_NAME
    payload["unit"] = "bits"
    json.dump(payload, sys.stdout, indent=2 if args.pretty else None)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
