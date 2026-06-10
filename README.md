# Percept

> Understand how your slides hit the brain.

Percept is a web app that scores presentation slides on **attention**, **comprehension**, and **cognitive load** using a neural encoding model trained on fMRI data. Upload a `.ppt`, `.pptx`, or `.pdf`, and Percept converts every slide to an image, runs each one through the model, and returns per-slide cognitive scores.

Built as a final-year CSE project at the **Islamic University of Science and Technology, Kashmir** (Batch 2023–27).

---

## What it does

1. You drop a presentation file on the upload page.
2. The server converts the file to PNG slides using LibreOffice + Poppler.
3. Each slide is sent to a Python backend hosted on a Hugging Face Space.
4. The backend returns `{ attention, comprehension, cognitiveLoad }` per slide.
5. The analysis page renders per-slide scores plus aggregate averages.

## Tech stack

**Frontend / API layer (this repo)**
- Next.js 16 (App Router) on React 19
- TypeScript
- Tailwind CSS v4 + shadcn/ui + Radix
- Framer Motion, lucide-react, react-dropzone

**Slide preprocessing**
- LibreOffice (`soffice`) — converts PPT/PPTX → PDF
- Poppler (`pdftoppm`) — rasterises PDF pages → PNG

**Inference backend** (separate repo, deployed as a Hugging Face Space)
- Python · FastAPI
- TRIBE v2 · SigLIP · Grad-CAM
- Endpoint: `https://muizza13-percept-api.hf.space/analyze`

## Architecture

```
+---------------+        POST /api/convert         +-------------------+
|  upload page  |  --------------------------->    |  soffice + poppler |
|  (browser)    |  <---------- base64 PNGs ------- |   (Next.js route)  |
+---------------+                                  +-------------------+
        |
        |  for each slide: POST /api/analyze
        v
+-------------------+    multipart form-data    +--------------------------+
| /api/analyze (BFF)| ------------------------> | percept-api HF Space     |
|                   | <------ JSON scores ----- | (FastAPI, TRIBE v2)      |
+-------------------+                           +--------------------------+
        |
        v
+----------------+
| analysis page  |  reads results from sessionStorage
+----------------+
```

The Next.js routes act as a thin backend-for-frontend: `/api/convert` handles file conversion and `/api/analyze` proxies to the HF Space.

## Getting started

### Prerequisites

You need **LibreOffice** and **Poppler** installed locally for slide conversion to work.

```bash
# macOS
brew install --cask libreoffice
brew install poppler

# Debian / Ubuntu
sudo apt-get install libreoffice poppler-utils
```

Node.js 20+ is required.

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | What it does                       |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the Next.js dev server       |
| `npm run build` | Production build                   |
| `npm run start` | Run the built app                  |
| `npm run lint`  | Run ESLint                         |

### Environment variables

Currently the analyze route calls a public HF Space, so no key is required. The repo still references a legacy `HUGGINGFACE_API_KEY` via `lib/hf.ts` for future direct calls; you can leave it unset for now. Add a `.env.local` if you do need it:

```
HUGGINGFACE_API_KEY=hf_...
```

## Project structure

```
app/
  page.tsx              Landing page
  about/page.tsx        About / team page
  upload/page.tsx       File upload + slide preview
  analysis/page.tsx     Per-slide scores and averages
  api/
    convert/route.ts    PPT/PDF -> PNG via soffice + pdftoppm
    analyze/route.ts    Forwards a slide PNG to the HF Space
components/
  navbar.tsx
  upload-zone.tsx
  ui/                   shadcn primitives (button, card, skeleton)
lib/
  hf.ts                 Hugging Face client placeholder
  utils.ts              cn() helper
```

## Status

This is an early build. Things that work end-to-end:

- PPT / PPTX / PDF -> per-slide PNG extraction
- Calling the HF Space backend and rendering attention / comprehension / cognitive-load scores
- Aggregate averages and a per-slide breakdown UI

Things still on the roadmap:

- Grad-CAM heatmap overlay on each slide
- LLM-generated plain-English suggestions per slide
- Persistent history (Supabase)

## Team

| | |
|---|---|
| Salik Yousuf Shigan | Builder · IUST CSE 2023–27 |
| Muizza Muayqeeb Akram | Builder · IUST CSE 2023–27 |
| Shakeeb Arslan Naqash | Builder · IUST CSE 2023–27 |

**Supervisor:** Dr. Sahil Sholla, Department of Computer Science, IUST Kashmir.
