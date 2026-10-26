import type {
  HealthResponse,
  ModelsResponse,
  DqnStatusResponse,
  LlmStatusResponse,
  PredictionResponse,
  XaiResultResponse,
} from './types';
import dqnMeta from '../data/dqn_meta.json';

// ─────────────────────────────────────────────
//  CANONICAL SYMPTOMS & VERIFIED METADATA
// ─────────────────────────────────────────────
export const DEMO_SYMPTOMS: string[] = dqnMeta.canonical_symptoms;

export const DEMO_HEALTH: HealthResponse = {
  status: 'healthy (Demo Mode)',
  engine_loaded: true,
  xai: {
    gradcam: {
      method: 'gradcam',
      label: 'Grad-CAM',
      description: 'Gradient-weighted class activation mapping (ResNet50 Layer4)',
      available: true,
      reason: null,
    },
    lime: {
      method: 'lime',
      label: 'LIME',
      description: 'Local interpretable model-agnostic explanations (Superpixel surrogate)',
      available: true,
      reason: null,
    },
    shap: {
      method: 'shap',
      label: 'SHAP',
      description: 'Shapley additive explanations (Partition & feature attribution)',
      available: true,
      reason: null,
    },
  },
  gpu: {
    cuda_available: false,
    device: 'Client Browser Simulation (WebGL/Canvas)',
    torch_version: '2.4.0+cpu (Simulated)',
    gpu_name: 'Client Virtual Acceleration Engine',
    vram_total_gb: 8.0,
  },
};

export const DEMO_MODELS: ModelsResponse = {
  cnns: ['chest', 'brain', 'skin', 'eye'],
  dqn: true,
  gemma4: false,
  device: 'Client Simulation (Web Static)',
  cnn_test_accuracy: {
    chest: 0.9295,
    brain: 0.9544,
    skin: 0.5932,
    eye: 0.8333,
  },
  cnn_accuracy_source: 'cnn/*meta*.json (independent evaluation files)',
};

export const DEMO_DQN_STATUS: DqnStatusResponse = {
  loaded: true,
  available: true,
  checkpoint_expected: 'dqn_model.pth',
  checkpoint_found: true,
  symptom_count: DEMO_SYMPTOMS.length,
  reason: null,
  note: 'Simulated Clinical Triage MDP (Demo Mode active)',
};

export const DEMO_LLM_STATUS: LlmStatusResponse = {
  loaded: false,
  available: false,
  provider: 'Gemma 4 (Gemini API)',
  mode: 'Demonstration Synthesis',
  model: 'gemma-4-clinical-demo',
  sdk_installed: true,
  api_key_set: false,
  reason: 'Live Gemma 4 API requires connected backend service',
  note: 'Demonstration findings enabled with precomputed clinical report templates',
};

// ─────────────────────────────────────────────
//  DEMO PREDICTIONS PER MODALITY
// ─────────────────────────────────────────────
interface ModalityProfile {
  predictedClass: string;
  confidence: number;
  allScores: Record<string, number>;
  emergencyDefault: boolean;
  priorityDefault: number;
  priorityLabelDefault: string;
  hotspot: { x: number; y: number; rx: number; ry: number };
  findingReport: string;
}

const MODALITY_PROFILES: Record<string, ModalityProfile> = {
  chest: {
    predictedClass: 'PNEUMONIA',
    confidence: 0.942,
    allScores: {
      PNEUMONIA: 0.942,
      NORMAL: 0.058,
    },
    emergencyDefault: false,
    priorityDefault: 2,
    priorityLabelDefault: 'Priority 2 (Urgent Care within 24 Hours)',
    hotspot: { x: 0.62, y: 0.58, rx: 0.22, ry: 0.18 },
    findingReport:
      '[DEMONSTRATION FINDING - SIMULATED CLINICAL REPORT]\n' +
      'Modality: Chest Radiography (PA View)\n' +
      'Technique: Neural visual feature analysis via ResNet50\n' +
      'Observations: Opacification and consolidation noted over the right lower thoracic zone with silhouette blurring of the right hemidiaphragm. Increased vascular prominence.\n' +
      'Impression: Findings strongly suspicious for acute bacterial or viral pneumonia (94.2% confidence). Triage escalation recommends urgent pulse oximetry, sputum culture, and clinician review.\n' +
      'Note: This is simulated demonstration data generated client-side for platform evaluation.',
  },
  brain: {
    predictedClass: 'glioma',
    confidence: 0.961,
    allScores: {
      glioma: 0.961,
      meningioma: 0.024,
      pituitary: 0.011,
      notumor: 0.004,
    },
    emergencyDefault: false,
    priorityDefault: 2,
    priorityLabelDefault: 'Priority 2 (Urgent Care within 24 Hours)',
    hotspot: { x: 0.38, y: 0.44, rx: 0.18, ry: 0.18 },
    findingReport:
      '[DEMONSTRATION FINDING - SIMULATED CLINICAL REPORT]\n' +
      'Modality: Brain Magnetic Resonance Imaging (T1/T2 Axial)\n' +
      'Technique: 4-Class neuro-oncology neural classifier\n' +
      'Observations: Hyperintense, heterogeneous mass lesion with mass effect and surrounding peri-tumoral vasogenic edema localized to the left frontoparietal parenchymal region.\n' +
      'Impression: High radiological suspicion for Glioma (96.1% confidence). Prompt neurosurgical evaluation, stereotactic contrast MRI, and biopsy planning recommended.\n' +
      'Note: This is simulated demonstration data generated client-side for platform evaluation.',
  },
  eye: {
    predictedClass: 'Moderate',
    confidence: 0.887,
    allScores: {
      Moderate: 0.887,
      Mild: 0.072,
      Severe: 0.025,
      No_DR: 0.012,
      Proliferate_DR: 0.004,
    },
    emergencyDefault: false,
    priorityDefault: 3,
    priorityLabelDefault: 'Priority 3 (Non-Urgent / Routine Follow-up)',
    hotspot: { x: 0.52, y: 0.54, rx: 0.25, ry: 0.25 },
    findingReport:
      '[DEMONSTRATION FINDING - SIMULATED CLINICAL REPORT]\n' +
      'Modality: High-Resolution Retinal Fundus Photography\n' +
      'Technique: 5-Stage Diabetic Retinopathy classifier\n' +
      'Observations: Multiple intraretinal microaneurysms, scattered dot-and-blot retinal hemorrhages, and distinct hard lipid exudates in the temporal macular arcade.\n' +
      'Impression: Features indicative of Moderate Non-Proliferative Diabetic Retinopathy (Stage 2). Recommended glycemic optimization, optical coherence tomography (OCT), and 3-month ophthalmic surveillance.\n' +
      'Note: This is simulated demonstration data generated client-side for platform evaluation.',
  },
  skin: {
    predictedClass: 'melanoma',
    confidence: 0.874,
    allScores: {
      melanoma: 0.874,
      nevus: 0.081,
      'basal cell carcinoma': 0.027,
      'pigmented benign keratosis': 0.012,
      'squamous cell carcinoma': 0.006,
    },
    emergencyDefault: false,
    priorityDefault: 2,
    priorityLabelDefault: 'Priority 2 (Urgent Care within 24 Hours)',
    hotspot: { x: 0.5, y: 0.5, rx: 0.28, ry: 0.28 },
    findingReport:
      '[DEMONSTRATION FINDING - SIMULATED CLINICAL REPORT]\n' +
      'Modality: Polarized Contact Dermoscopy\n' +
      'Technique: Multi-class melanocytic & non-melanocytic lesion classifier\n' +
      'Observations: Asymmetric pigmented lesion exhibiting irregular borders, atypical pigment network disruption, and focal peripheral pseudopods.\n' +
      'Impression: High index of suspicion for early malignant melanoma (87.4% confidence). Complete excisional biopsy with 1-2mm histological clearance margins strongly recommended.\n' +
      'Note: This is simulated demonstration data generated client-side for platform evaluation.',
  },
};

// High-acuity symptoms that trigger Priority 1 Emergency
const EMERGENCY_SYMPTOMS = [
  'chest pain',
  'chest tightness',
  'chest pressure',
  'shortness of breath',
  'difficulty breathing',
  'cyanosis (turning blue)',
  'anaphylaxis / throat swelling',
  'altered mental status',
  'fainting / syncope',
  'vomiting blood',
  'sudden severe headache',
  'seizures / convulsions',
  'sudden vision loss',
];

export function generateDemoPrediction(
  scanType: string,
  symptoms: string[] = [],
  generateReport: boolean = true
): PredictionResponse {
  const normalizedType = scanType.toLowerCase();
  const profile = MODALITY_PROFILES[normalizedType] || MODALITY_PROFILES.chest;

  // Check if any emergency symptoms selected
  const hasEmergency = symptoms.some((s) =>
    EMERGENCY_SYMPTOMS.some((e) => s.toLowerCase().includes(e))
  );

  const matched = symptoms.filter((s) =>
    DEMO_SYMPTOMS.some((c) => c.toLowerCase() === s.toLowerCase())
  );

  let priority = profile.priorityDefault;
  let priorityLabel = profile.priorityLabelDefault;
  if (hasEmergency) {
    priority = 1;
    priorityLabel = 'Priority 1 (Immediate Emergency Care)';
  } else if (symptoms.length > 2) {
    priority = 2;
    priorityLabel = 'Priority 2 (Urgent Care within 24 Hours)';
  }

  return {
    scan_type: normalizedType,
    symptoms: symptoms,
    cnn_result: {
      model: 'ResNet50 (Demo Simulation)',
      prediction: profile.predictedClass,
      confidence: profile.confidence,
      all_scores: profile.allScores,
    },
    dqn_result: {
      model: 'DQN Triage Agent v1.0.0 (Demo Mode)',
      matched_symptoms: matched.length > 0 ? matched : symptoms,
      action: priority - 1,
      priority: priority,
      priority_label: priorityLabel,
      emergency: hasEmergency,
    },
    emergency: hasEmergency,
    call_108: hasEmergency,
    report: generateReport ? profile.findingReport : null,
  };
}

// ─────────────────────────────────────────────
//  CLIENT-SIDE CANVAS XAI VISUALIZATION GENERATOR
// ─────────────────────────────────────────────

function loadImage(src: string | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for XAI synthesis'));

    if (src instanceof Blob) {
      img.src = URL.createObjectURL(src);
    } else {
      img.src = src;
    }
  });
}

// JET Colormap interpolation (standard for Grad-CAM)
function jetColor(val: number): [number, number, number] {
  const v = Math.max(0, Math.min(1, val));
  let r = 0;
  let g = 0;
  let b = 0;

  if (v < 0.125) {
    b = 0.5 + v * 4;
  } else if (v < 0.375) {
    b = 1;
    g = (v - 0.125) * 4;
  } else if (v < 0.625) {
    b = 1 - (v - 0.375) * 4;
    g = 1;
    r = (v - 0.375) * 4;
  } else if (v < 0.875) {
    g = 1 - (v - 0.625) * 4;
    r = 1;
  } else {
    r = 1 - (v - 0.875) * 2;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// COOLWARM Colormap interpolation (standard for SHAP diverging attributions)
function coolwarmColor(val: number): [number, number, number] {
  const v = Math.max(-1, Math.min(1, val));
  if (v < 0) {
    // Negative attributions: Cool Blue
    const t = -v;
    return [Math.round(59 + (1 - t) * 196), Math.round(76 + (1 - t) * 179), Math.round(192 + (1 - t) * 63)];
  } else {
    // Positive attributions: Warm Red
    const t = v;
    return [Math.round(180 + t * 75), Math.round(242 - t * 200), Math.round(242 - t * 200)];
  }
}

export async function generateDemoXai(
  imageSource: Blob | string,
  scanType: string,
  method: 'gradcam' | 'lime' | 'shap',
  params: Record<string, any> = {}
): Promise<XaiResultResponse> {
  const normalizedType = scanType.toLowerCase();
  const profile = MODALITY_PROFILES[normalizedType] || MODALITY_PROFILES.chest;
  const hotspot = profile.hotspot;

  let img: HTMLImageElement;
  try {
    img = await loadImage(imageSource);
  } catch {
    // If image loading fails, create placeholder canvas
    const c = document.createElement('canvas');
    c.width = 300;
    c.height = 300;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 300, 300);
    img = new Image();
    img.src = c.toDataURL();
  }

  const width = Math.min(img.naturalWidth || 400, 512);
  const height = Math.min(img.naturalHeight || 400, 512);

  // Canvas for base image
  const baseCanvas = document.createElement('canvas');
  baseCanvas.width = width;
  baseCanvas.height = height;
  const baseCtx = baseCanvas.getContext('2d')!;
  baseCtx.drawImage(img, 0, 0, width, height);
  const originalDataUrl = baseCanvas.toDataURL('image/png');

  // Centers of attribution activation
  const cx = width * hotspot.x;
  const cy = height * hotspot.y;

  if (method === 'gradcam') {
    // ── 1. GRAD-CAM: Pure Heatmap Canvas ──
    const heatCanvas = document.createElement('canvas');
    heatCanvas.width = width;
    heatCanvas.height = height;
    const heatCtx = heatCanvas.getContext('2d')!;
    const heatImgData = heatCtx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = (x - cx) / (width * hotspot.rx);
        const dy = (y - cy) / (height * hotspot.ry);
        const distSq = dx * dx + dy * dy;
        const activation = Math.exp(-distSq * 2.2);

        const [r, g, b] = jetColor(activation);
        const idx = (y * width + x) * 4;
        heatImgData.data[idx] = r;
        heatImgData.data[idx + 1] = g;
        heatImgData.data[idx + 2] = b;
        heatImgData.data[idx + 3] = 255;
      }
    }
    heatCtx.putImageData(heatImgData, 0, 0);

    // ── 2. GRAD-CAM: Alpha Overlay Canvas ──
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = width;
    overlayCanvas.height = height;
    const overlayCtx = overlayCanvas.getContext('2d')!;
    overlayCtx.drawImage(img, 0, 0, width, height);

    // Render transparent jet heatmap on top
    const blendCanvas = document.createElement('canvas');
    blendCanvas.width = width;
    blendCanvas.height = height;
    const blendCtx = blendCanvas.getContext('2d')!;
    const blendImgData = blendCtx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = (x - cx) / (width * hotspot.rx);
        const dy = (y - cy) / (height * hotspot.ry);
        const distSq = dx * dx + dy * dy;
        const activation = Math.exp(-distSq * 2.2);

        const [r, g, b] = jetColor(activation);
        const idx = (y * width + x) * 4;
        blendImgData.data[idx] = r;
        blendImgData.data[idx + 1] = g;
        blendImgData.data[idx + 2] = b;
        // Fade out in cold regions so anatomical scan remains clear
        blendImgData.data[idx + 3] = Math.round(Math.max(0, activation - 0.15) * 180);
      }
    }
    blendCtx.putImageData(blendImgData, 0, 0);
    overlayCtx.drawImage(blendCanvas, 0, 0);

    // Add subtle visual watermark for clinical clarity
    overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    overlayCtx.fillRect(8, height - 24, 180, 18);
    overlayCtx.fillStyle = '#00E5FF';
    overlayCtx.font = '10px monospace';
    overlayCtx.fillText('DEMO: Grad-CAM Activation', 12, height - 12);

    const heatmapUrl = heatCanvas.toDataURL('image/png');
    const overlayUrl = overlayCanvas.toDataURL('image/png');

    return {
      method: 'gradcam',
      method_label: 'Grad-CAM',
      scan_type: normalizedType,
      predicted_class: profile.predictedClass,
      confidence: profile.confidence,
      target_class: profile.predictedClass,
      images: {
        original: originalDataUrl,
        heatmap: heatmapUrl,
        overlay: overlayUrl,
        panel: overlayUrl,
      },
      explanation_image: overlayUrl,
      parameters: { target_layer: 'layer4', colormap: 'jet', alpha: 0.55 },
      metadata: { simulated: true, modality: normalizedType },
      warnings: [
        '[DEMO MODE] This Grad-CAM activation map is simulated for demonstration purposes and does not represent an actual neural network gradient execution.',
      ],
    };
  } else if (method === 'lime') {
    // ── LIME: Superpixel-based explanation ──
    const limeCanvas = document.createElement('canvas');
    limeCanvas.width = width;
    limeCanvas.height = height;
    const limeCtx = limeCanvas.getContext('2d')!;
    limeCtx.drawImage(img, 0, 0, width, height);

    // Create superpixel grid/contours
    const gridSize = Math.max(16, Math.floor(width / 14));
    limeCtx.lineWidth = 1;
    limeCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';

    for (let gx = 0; gx < width; gx += gridSize) {
      for (let gy = 0; gy < height; gy += gridSize) {
        const cellCenterX = gx + gridSize / 2;
        const cellCenterY = gy + gridSize / 2;
        const dx = (cellCenterX - cx) / (width * hotspot.rx);
        const dy = (cellCenterY - cy) / (height * hotspot.ry);
        const distSq = dx * dx + dy * dy;

        limeCtx.strokeRect(gx, gy, gridSize, gridSize);

        if (distSq < 0.65) {
          // Strong positive contributor (green)
          limeCtx.fillStyle = 'rgba(52, 211, 153, 0.45)';
          limeCtx.fillRect(gx, gy, gridSize, gridSize);
          limeCtx.strokeStyle = '#34D399';
          limeCtx.strokeRect(gx, gy, gridSize, gridSize);
          limeCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        } else if (distSq >= 0.65 && distSq < 1.3) {
          // Moderate positive contributor
          limeCtx.fillStyle = 'rgba(52, 211, 153, 0.22)';
          limeCtx.fillRect(gx, gy, gridSize, gridSize);
        } else if (distSq >= 2.5 && distSq < 4.0 && (gx + gy) % 3 === 0) {
          // Minor negative contributor (red)
          limeCtx.fillStyle = 'rgba(251, 113, 133, 0.35)';
          limeCtx.fillRect(gx, gy, gridSize, gridSize);
        }
      }
    }

    // Watermark
    limeCtx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    limeCtx.fillRect(8, height - 24, 180, 18);
    limeCtx.fillStyle = '#34D399';
    limeCtx.font = '10px monospace';
    limeCtx.fillText('DEMO: LIME Superpixels', 12, height - 12);

    const limeUrl = limeCanvas.toDataURL('image/png');

    return {
      method: 'lime',
      method_label: 'LIME',
      scan_type: normalizedType,
      predicted_class: profile.predictedClass,
      confidence: profile.confidence,
      target_class: profile.predictedClass,
      images: {
        original: originalDataUrl,
        lime_positive: limeUrl,
        lime_positive_negative: limeUrl,
        overlay: limeUrl,
        panel: limeUrl,
      },
      explanation_image: limeUrl,
      parameters: { num_samples: 50, num_features: 6, ...params },
      metadata: { simulated: true, modality: normalizedType },
      warnings: [
        '[DEMO MODE] This LIME explanation map is simulated client-side for demonstration and does not reflect a live local surrogate linear model.',
      ],
    };
  } else {
    // ── SHAP: Diverging Shapley Attributions ──
    const shapCanvas = document.createElement('canvas');
    shapCanvas.width = width;
    shapCanvas.height = height;
    const shapCtx = shapCanvas.getContext('2d')!;
    shapCtx.drawImage(img, 0, 0, width, height);

    const shapBlendCanvas = document.createElement('canvas');
    shapBlendCanvas.width = width;
    shapBlendCanvas.height = height;
    const shapBlendCtx = shapBlendCanvas.getContext('2d')!;
    const shapImgData = shapBlendCtx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = (x - cx) / (width * hotspot.rx);
        const dy = (y - cy) / (height * hotspot.ry);
        const distSq = dx * dx + dy * dy;

        // Positive in center (+ attribution towards predicted class)
        // Negative in surrounding halo (- attribution against)
        let shapValue = 0;
        if (distSq < 1.0) {
          shapValue = Math.exp(-distSq * 2.0);
        } else if (distSq < 3.2) {
          shapValue = -0.4 * Math.sin((distSq - 1.0) * Math.PI * 0.5);
        }

        const [r, g, b] = coolwarmColor(shapValue);
        const idx = (y * width + x) * 4;
        shapImgData.data[idx] = r;
        shapImgData.data[idx + 1] = g;
        shapImgData.data[idx + 2] = b;
        shapImgData.data[idx + 3] = Math.round(Math.min(1, Math.abs(shapValue)) * 170);
      }
    }
    shapBlendCtx.putImageData(shapImgData, 0, 0);
    shapCtx.drawImage(shapBlendCanvas, 0, 0);

    // Watermark
    shapCtx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    shapCtx.fillRect(8, height - 24, 180, 18);
    shapCtx.fillStyle = '#A78BFA';
    shapCtx.font = '10px monospace';
    shapCtx.fillText('DEMO: SHAP Diverging Attrib', 12, height - 12);

    const shapUrl = shapCanvas.toDataURL('image/png');

    return {
      method: 'shap',
      method_label: 'SHAP',
      scan_type: normalizedType,
      predicted_class: profile.predictedClass,
      confidence: profile.confidence,
      target_class: profile.predictedClass,
      images: {
        original: originalDataUrl,
        overlay_signed: shapUrl,
        heatmap: shapUrl,
        overlay: shapUrl,
        panel: shapUrl,
      },
      explanation_image: shapUrl,
      parameters: { max_evals: 64, ...params },
      metadata: { simulated: true, modality: normalizedType },
      warnings: [
        '[DEMO MODE] This SHAP attribution map is client-side simulated demonstration data and not generated from Shapley game-theoretic permutations.',
      ],
    };
  }
}
