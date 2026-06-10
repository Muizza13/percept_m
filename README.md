# Percept

Percept is a web application that evaluates presentation slides on three cognitive dimensions — **attention**, **comprehension**, and **cognitive load** — using a neural encoding model trained on fMRI data. Users upload a `.ppt`, `.pptx`, or `.pdf` file; the application converts each slide into an image, submits it to the inference backend, and presents per-slide and aggregate scores.

Developed as a final-year project in the Department of Computer Science and Engineering, Islamic University of Science and Technology, Kashmir (Batch 2023–27).

---

## Overview

The application implements the following pipeline:

1. The user uploads a presentation through the browser.
2. The server converts the file into per-slide PNG images using LibreOffice and Poppler.
3. Each slide is forwarded to a Python inference service deployed on a Hugging Face Space.
4. The service returns a JSON payload containing `attention`, `comprehension`, and `cognitiveLoad` for the slide.
5. The results are aggregated and rendered on the analysis page.

## Technology Stack

**Application layer (this repository)**

- Next.js 16 (App Router) on React 19
- TypeScript
- Tailwind CSS v4, shadcn/ui, Radix UI
- Framer Motion, lucide-react, react-dropzone

**Slide preprocessing**

- LibreOffice (`soffice`) — converts PPT/PPTX to PDF
- Poppler (`pdftoppm`) — rasterises PDF pages into PNG

**Inference backend** (maintained in a separate repository and deployed as a Hugging Face Space)

- Python with FastAPI
- TRIBE v2, SigLIP, Grad-CAM
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

The Next.js route handlers serve as a thin backend-for-frontend layer: `/api/convert` performs file conversion, and `/api/analyze` proxies requests to the inference service.

## Getting Started

### Prerequisites

The slide conversion pipeline requires **LibreOffice** and **Poppler** to be installed locally.

```bash
# macOS
brew install --cask libreoffice
brew install poppler

# Debian / Ubuntu
sudo apt-get install libreoffice poppler-utils
```

Node.js 20 or later is required.

### Installation

```bash
npm install
npm run dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Starts the Next.js development server    |
| `npm run build` | Produces a production build              |
| `npm run start` | Runs the production build                |
| `npm run lint`  | Runs ESLint                              |

### Environment Variables

The current implementation calls a public Hugging Face Space, and therefore does not require an API key. A `HUGGINGFACE_API_KEY` reference is retained in `lib/hf.ts` for future direct calls to the Hugging Face Inference API. To configure it, create a `.env.local` file at the project root:

```
HUGGINGFACE_API_KEY=hf_...
```

## Project Structure

```
app/
  page.tsx              Landing page
  about/page.tsx        About and team page
  upload/page.tsx       File upload and slide preview
  analysis/page.tsx     Per-slide scores and aggregate metrics
  api/
    convert/route.ts    PPT/PDF to PNG conversion via soffice and pdftoppm
    analyze/route.ts    Forwards a slide image to the inference backend
components/
  navbar.tsx
  upload-zone.tsx
  ui/                   shadcn primitives (button, card, skeleton)
lib/
  hf.ts                 Hugging Face client placeholder
  utils.ts              Utility helpers
```

## Project Status

The following components are functional end-to-end:

- Conversion of PPT, PPTX, and PDF files into per-slide PNG images
- Communication with the Hugging Face Space backend
- Rendering of attention, comprehension, and cognitive-load scores
- Aggregate averages and a per-slide breakdown view

Planned work includes:

- Grad-CAM heatmap overlays on each slide
- LLM-generated, plain-language suggestions for slide improvement
- Persistent history and user accounts (Supabase)

## Team

| Name                    | Role                              |
| ----------------------- | --------------------------------- |
| Salik Yousuf Shigan     | Developer · IUST CSE 2023–27      |
| Muizza Muayqeeb Akram   | Developer · IUST CSE 2023–27      |
| Shakeeb Arslan Naqash   | Developer · IUST CSE 2023–27      |

**Supervisor:** Dr. Sahil Sholla, Department of Computer Science and Engineering, Islamic University of Science and Technology, Kashmir.
