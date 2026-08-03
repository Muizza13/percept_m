# Percept

Percept is a web application that evaluates presentation slides on three dimensions of visual communication quality — **attention**, **comprehension**, and **cognitive load**. A user uploads a `.ppt`, `.pptx`, or `.pdf`; each page is rasterised to a PNG and scored by Google Gemini (`gemini-3.5-flash`) against a fixed JSON schema. The model also returns a short insight and recommendations. Results are held in `sessionStorage` and shown on the analysis page.

Developed as a final-year undergraduate project (Group 10) in the Department of Computer Science and Engineering, Islamic University of Science and Technology, Kashmir (Batch 2023–27). Supervisor: Dr. Sahil Sholla, Assistant Professor.

The scoring dimensions are motivated by cognitive load theory (Sweller, 1988), dual coding theory (Paivio, 1991), and multimedia learning principles (Mayer, 2009). Scores are heuristic ratings from a general-purpose vision-language model, not measurements of neural response.

---

## Overview

1. The user uploads a presentation through the browser.
2. LibreOffice converts `.ppt` / `.pptx` to PDF; Poppler (`pdftoppm`) rasterises each page to PNG.
3. Images are cached on disk under `.percept-cache/<deckId>/`, keyed by a UUID.
4. Each slide image is sent to Google Gemini with a Zod-derived JSON schema.
5. The response (scores, insight, recommendations) is stored in `sessionStorage` and rendered on `/analysis`.
6. Separately, `scripts/surprisal.py` can compute GPT-2 surprisal over text extracted from the PDF with `pdftotext`. That signal is an auxiliary text statistic; it is not used to derive any score.

## Technology Stack

**Application**

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS, shadcn/ui
- Google Gemini via `@google/genai`
- Zod (request and response validation)

**Slide preprocessing**

- LibreOffice (`soffice`) — PPT/PPTX → PDF
- Poppler (`pdftoppm`, `pdftotext`) — PDF → PNG; optional text extraction

**Auxiliary surprisal script**

- Python 3, PyTorch, Hugging Face `transformers` (GPT-2)

## Architecture

```
+---------------+      POST /api/convert       +---------------------------+
|  /upload      | ---------------------------> | soffice + pdftoppm         |
|  (browser)    | <--- deckId + slide refs --- | .percept-cache/<deckId>/   |
+---------------+                              +---------------------------+
        |
        |  for each slide: POST /api/analyze { deckId, slideIndex }
        v
+-------------------+   slide PNG + schema    +--------------------------+
| /api/analyze      | ----------------------> | Google Gemini            |
| (Next.js route)   | <--- JSON scores ------ | gemini-3.5-flash         |
+-------------------+                         +--------------------------+
        |
        v
+----------------+
| /analysis      |  reads results from sessionStorage
+----------------+

Optional (detached):
  scripts/surprisal.py  --  pdftotext + GPT-2 surprisal over slide text
```

`/api/convert` writes PNGs to the local cache and returns light slide references. `/api/analyze` reads a cached PNG and calls Gemini. Slide images are also served via `/api/slides/[deckId]/[index]`.

## Getting Started

### Prerequisites

- Node.js 20 or later
- LibreOffice and Poppler on `PATH`

```bash
# macOS
brew install --cask libreoffice
brew install poppler

# Debian / Ubuntu
sudo apt-get install libreoffice poppler-utils
```

For the optional surprisal script: Python 3 with `torch` and `transformers`, and `pdftotext` on `PATH`.

### Installation

```bash
npm install
npm run dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start the Next.js development server  |
| `npm run build` | Produce a production build            |
| `npm run start` | Run the production build              |
| `npm run lint`  | Run ESLint                            |

### Environment Variables

Create `.env.local` at the project root:

```
GEMINI_API_KEY=...
```

`GEMINI_API_KEY` is required for `/api/analyze`. Without it the route returns a configuration error.

### Optional surprisal script

```bash
# After converting a deck to PDF (same as the convert route):
soffice --headless --convert-to pdf yourdeck.pptx

python3 scripts/surprisal.py yourdeck.pdf
python3 scripts/surprisal.py yourdeck.pdf --pretty
```

Output is JSON on stdout (per-page token counts and surprisal statistics). This script is not invoked by the Next.js analyze route and does not affect slide scores.

## Project Structure

```
app/
  page.tsx                 Landing page
  about/page.tsx           About and team
  upload/page.tsx          Upload, convert, analyse
  analysis/page.tsx        Per-slide scores and aggregates
  api/
    convert/route.ts       PPT/PDF → PNG cache via soffice and pdftoppm
    analyze/route.ts       Gemini scoring against a Zod schema
    slides/[deckId]/[index]/route.ts   Serve cached PNGs
components/
  landing/                 Landing sections
  navbar.tsx, upload-zone.tsx, …
lib/
  deck-cache.ts            Disk cache for deck PNGs
  insights.ts              Schemas and fallback insight/recommendation text
  slides.ts                Slide reference helpers
  team.ts                  Team and supervisor metadata
  utils.ts                 Utility helpers
scripts/
  surprisal.py             GPT-2 surprisal over pdftotext output
```

## Project Status

Implemented end to end:

- Conversion of PPT, PPTX, and PDF into per-slide PNGs
- Gemini structured scoring (attention, comprehension, cognitive load, insight, recommendations)
- Analysis UI with aggregates and per-slide breakdown
- Standalone GPT-2 surprisal script over extracted slide text

Unbuilt future work:

- **Saliency-based fixation prediction overlays** (e.g. DeepGaze, TranSalNet), not Grad-CAM. Grad-CAM would show where the scoring model attended, which is not the same as where a human would look; a human-fixation saliency model is the appropriate direction if heatmaps are added.
- Persistent history and user accounts

## Limitations

- Scores are produced by a general-purpose vision-language model and are a **proxy for visual-communication quality**, not a measurement of neural response.
- A GPT-2 surprisal signal over extracted slide text was evaluated on five matched text-heavy / visual-rich slide pairs. Mean surprisal was higher for the visual-rich variant in all five pairs — i.e. inversely related to the intended direction — because fragmented labels are unpredictable to a language model while remaining easy for a human to scan. Total surprisal stayed roughly flat because reduced token count and increased per-token surprisal cancel. Surprisal is therefore reported only as an auxiliary text statistic and is **not used to derive any score**.
- The system has **not yet been validated against human ratings**.

## Team

| Name                  | Role                         |
| --------------------- | ---------------------------- |
| Salik Yousuf Shigan   | Developer · IUST CSE 2023–27 |
| Muizza Muayqeeb Akram | Developer · IUST CSE 2023–27 |
| Shakeeb Arslan Naqash | Developer · IUST CSE 2023–27 |

**Supervisor:** Dr. Sahil Sholla, Assistant Professor, Department of Computer Science and Engineering, Islamic University of Science and Technology, Kashmir.
