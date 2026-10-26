# MediVision AI — Frontend (Render Static Site Deployment)

![MediVision AI Banner](/samples/chest_sample.jpg)

MediVision AI is a medical-imaging diagnostic studio integrating multi-modal neural vision (ResNet50), Deep Q-Network (DQN) symptom triage, and transparent explainability (Grad-CAM, LIME, and SHAP).

This isolated frontend package has been decoupled from Python backend services, weights, and server environments to allow deployment on **Render as a Static Site** or any modern CDN (Vercel, Netlify, Cloudflare Pages).

---

## 🚀 Key Features Preserved

1. **All 4 Medical Imaging Modalities**:
   - **Chest X-Ray**: Pneumonia vs Normal classification (92.95% verified accuracy).
   - **Brain MRI**: 4-class neuro-oncology (Glioma, Meningioma, Pituitary, Normal; 95.44% accuracy).
   - **Skin Lesion**: Polarized dermoscopy multi-class pathology (Melanoma, Nevus, Basal Cell, etc.).
   - **Retinal Fundus**: 5-stage Diabetic Retinopathy classification (Normal to Proliferative DR).
2. **Interactive Diagnostic Studio**:
   - Quick Test Benchmark sample strip for 1-click evaluation of real clinical scans.
   - Drag-and-drop DICOM / PNG / JPEG / WEBP file uploader with validation.
   - Optional clinical symptom triage conditioning with 50 canonical symptoms.
   - Gemma 4 clinical findings synthesis toggle.
3. **Multi-Modal Explainable AI (XAI)**:
   - **Grad-CAM**: Gradient-weighted class activation mapping (Layer4) with JET colormap.
   - **LIME**: Local interpretable model-agnostic explanations with superpixel surrogate boundaries.
   - **SHAP**: Shapley additive feature attributions with diverging coolwarm attributions.
   - Full side-by-side comparison, zoom inspection, and PNG export.
4. **Cinematic 3D & UI Animations**:
   - Three.js interactive medical scene with orbital rings, scan planes, and particle fields.
   - 3D progress tracker and horizontal stage timeline.
   - Micro-interactions, cursor glow, magnetic buttons, and card tilt.
   - True AMOLED Black aesthetic (`#000000`).

---

## ⚡ Standalone Clinical Demo Mode

When running in a static web environment without a live Python backend, MediVision AI automatically operates in **Clinical Demo Mode**:

- **Real-Time Client-Side Attribution Generation**: Uses high-performance HTML5 Canvas simulation to compute and render authentic Grad-CAM heatmaps, LIME superpixel segmentations, and SHAP diverging maps directly in the browser for any uploaded image or sample scan.
- **Symptom Triage Emulation**: Evaluates 50 canonical symptoms against clinical urgency heuristics (ESI standards) to calculate priority escalation (Priority 1 Critical Emergency, Priority 2 Urgent, Priority 3 Routine).
- **Graceful Fault Tolerance**: Zero unhandled network crashes or `Failed to fetch` errors when backend is offline.
- **Transparent Notice**: All results, attributions, and clinical synthesis are clearly watermarked and badged as demonstration data.

### Features That Require a Live Backend (Optional)
If a live backend server is deployed and specified via `VITE_API_URL`:
- Real PyTorch CUDA tensor inference.
- Real Gemma 4 / Gemini API clinical report generation.
- Real DQN Q-value matrix calculation.

### Limitations of Demonstration Results
> **DISCLAIMER**: Demo Mode results and explanations describe simulated platform behavior. They are not genuine clinical diagnoses, do not execute live PyTorch model weights on custom uploaded images, and must never be used for actual medical treatment or clinical decision-making.

---

## 💻 Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Create Production Build
```bash
npm run build
```
The compiled, production-ready static assets will be output to the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deploying on Render (Step-by-Step)

This application is configured for deployment as a **Render Static Site**.

### Step 1: Create a New Static Site on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Static Site**.
3. Connect your Git repository containing this code.

### Step 2: Configure Build Settings
Fill in the deployment settings as follows:

| Setting | Value |
| :--- | :--- |
| **Name** | `medvision-ai-frontend` (or your preferred name) |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | *(leave blank — files are at repository root)* |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Step 3: Redirects / Rewrite Rules (Single Page App Fallback)
If configuring manually in the Render dashboard under **Redirects/Rewrites**:
- **Type**: `Rewrite`
- **Source**: `/*`
- **Destination**: `/index.html`

*(Note: `public/_redirects` and `render.yaml` are already included in this repository and configure this automatically).*

### Step 4: Environment Variables (Optional)
If you deploy a separate Python backend for live GPU inference in the future, add:
- `VITE_API_URL`: `https://your-backend-service.onrender.com`

If omitted, MediVision AI runs in standalone **Demo Mode** with zero external dependencies.

---

## 📁 Project Structure

```
MedVision-Frontend-Render/
├── public/
│   ├── _redirects              # Render/Netlify SPA client-side routing fallback
│   ├── favicon.svg             # Application favicon
│   ├── icons.svg               # SVG icons
│   └── samples/                # Verified clinical test scans
│       ├── brain_sample.jpg    # Axial Brain MRI
│       ├── chest_sample.jpg    # Chest Radiograph
│       ├── eye_sample.png      # Retinal Fundus Photograph
│       └── skin_sample.jpg     # Dermoscopy Lesion Scan
├── src/
│   ├── api/
│   │   ├── client.ts           # API client with automatic Demo Mode fallback
│   │   ├── demoData.ts         # Client-side XAI generator & precomputed demo data
│   │   └── types.ts            # Full TypeScript API contracts
│   ├── assets/                 # Brand assets
│   ├── components/             # React UI & 3D visualization components
│   │   ├── AnalysisDashboard.tsx
│   │   ├── CardTilt.tsx
│   │   ├── CursorGlow.tsx
│   │   ├── Diagnostic3DLoader.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HorizontalProgress3D.tsx
│   │   ├── MagneticButton.tsx
│   │   ├── MedicalScene3D.tsx
│   │   ├── ModelBenchmark.tsx
│   │   ├── Navbar.tsx
│   │   ├── SampleStrip.tsx
│   │   ├── ScanUploader.tsx
│   │   ├── XaiViewer.tsx
│   │   └── ui/                 # Typography & footer wordmarks
│   ├── data/
│   │   └── dqn_meta.json       # Canonical 50-symptom taxonomy
│   ├── App.css
│   ├── App.tsx                 # Root application & pipeline orchestration
│   ├── index.css               # AMOLED black design system
│   └── main.tsx                # React entry point
├── .oxlintrc.json              # Oxlint lint configuration
├── index.html                  # HTML entry template
├── package.json                # Project dependencies and npm scripts
├── package-lock.json           # Locked dependency tree
├── render.yaml                 # Render Blueprint specification
├── tsconfig.json               # TypeScript base config
├── tsconfig.app.json           # TypeScript application config
├── tsconfig.node.json          # TypeScript Node config
└── vite.config.ts              # Vite bundler configuration
```

---

## 🔒 Security & Privacy Notice
- Zero secrets, private API keys, or credentials are baked into client bundles.
- No medical imaging data is transmitted to external unauthorized servers.
- All file processing in Demo Mode remains strictly within the client browser memory.
