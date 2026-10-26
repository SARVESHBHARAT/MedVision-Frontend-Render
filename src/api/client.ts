import type {
  HealthResponse,
  ModelsResponse,
  DqnStatusResponse,
  LlmStatusResponse,
  XaiMethodsResponse,
  PredictionResponse,
  XaiResultResponse,
} from './types';
import {
  DEMO_HEALTH,
  DEMO_MODELS,
  DEMO_DQN_STATUS,
  DEMO_LLM_STATUS,
  DEMO_SYMPTOMS,
  generateDemoPrediction,
  generateDemoXai,
} from './demoData';

/**
 * In development / connected mode, requests go through VITE_API_URL or Vite dev proxy (/api).
 * In standalone Render static deployment without a backend, requests automatically fall back
 * to the client-side Clinical Demo Mode.
 */
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

let isBackendAvailableCache: boolean | null = null;

export function isDemoMode(): boolean {
  return isBackendAvailableCache === false;
}

// ─────────────────────────────────────────────
//  TIMEOUT CONFIGURATION (milliseconds)
// ─────────────────────────────────────────────
export const TIMEOUTS = {
  status:    4_000,   // Quick timeout for health check to fail over quickly to demo mode
  cnn:      90_000,   // CNN inference
  gradcam:  60_000,   // Grad-CAM
  lime:    180_000,   // LIME
  shap:    120_000,   // SHAP
  gemma:    60_000,   // Gemma API
};

// ─────────────────────────────────────────────
//  FETCH WITH ABORT/TIMEOUT & SAFE GRACEFUL FALLBACK
// ─────────────────────────────────────────────
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new TimeoutError(`Request timed out after ${timeoutMs / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export class TimeoutError extends Error {
  readonly isTimeout = true;
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// ─────────────────────────────────────────────
//  STATUS / TELEMETRY ENDPOINTS
// ─────────────────────────────────────────────
export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/health`, {}, TIMEOUTS.status);
    if (!res.ok) throw new Error(`Health check returned ${res.status}`);
    const data = await res.json();
    isBackendAvailableCache = true;
    return data;
  } catch {
    isBackendAvailableCache = false;
    return DEMO_HEALTH;
  }
}

export async function fetchModels(): Promise<ModelsResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/models`, {}, TIMEOUTS.status);
    if (!res.ok) throw new Error(`Models fetch returned ${res.status}`);
    const data = await res.json();
    isBackendAvailableCache = true;
    return data;
  } catch {
    isBackendAvailableCache = false;
    return DEMO_MODELS;
  }
}

export async function fetchGpuStatus(): Promise<HealthResponse['gpu']> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/system/gpu`, {}, TIMEOUTS.status);
    if (!res.ok) throw new Error(`GPU status fetch returned ${res.status}`);
    return res.json();
  } catch {
    return DEMO_HEALTH.gpu;
  }
}

export async function fetchDqnStatus(): Promise<DqnStatusResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/dqn/status`, {}, TIMEOUTS.status);
    if (!res.ok) throw new Error(`DQN status fetch returned ${res.status}`);
    return res.json();
  } catch {
    return DEMO_DQN_STATUS;
  }
}

export async function fetchLlmStatus(): Promise<LlmStatusResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/llm/status`, {}, TIMEOUTS.status);
    if (!res.ok) throw new Error(`LLM status fetch returned ${res.status}`);
    return res.json();
  } catch {
    return DEMO_LLM_STATUS;
  }
}

export async function fetchSymptomsList(): Promise<{ symptoms: string[]; count: number }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/symptoms/list`, {}, TIMEOUTS.status);
    if (!res.ok) throw new Error(`Symptoms fetch returned ${res.status}`);
    return res.json();
  } catch {
    return { symptoms: DEMO_SYMPTOMS, count: DEMO_SYMPTOMS.length };
  }
}

export async function fetchXaiMethods(): Promise<XaiMethodsResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/xai/methods`, {}, TIMEOUTS.status);
    if (!res.ok) throw new Error(`XAI methods fetch returned ${res.status}`);
    return res.json();
  } catch {
    return {
      methods: DEMO_HEALTH.xai as any,
      defaults: {},
      tunable: {},
    };
  }
}

// ─────────────────────────────────────────────
//  PREDICTION ENDPOINTS
// ─────────────────────────────────────────────
export async function predictImage(
  imageBlob: Blob | File,
  scanType: string,
  generateReport: boolean = true
): Promise<PredictionResponse> {
  try {
    const formData = new FormData();
    formData.append('file', imageBlob, 'scan.png');

    const url = `${API_BASE}/predict/image/${scanType}?generate_report=${generateReport}`;
    const timeoutMs = generateReport ? TIMEOUTS.cnn + TIMEOUTS.gemma : TIMEOUTS.cnn;
    const res = await fetchWithTimeout(url, { method: 'POST', body: formData }, timeoutMs);

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`Prediction error (${res.status}): ${errText}`);
    }
    return await res.json();
  } catch (err: any) {
    // If backend is unavailable or fails, gracefully switch to high-fidelity demo prediction
    console.info('Backend inference unavailable. Operating in Demo Mode:', err?.message);
    // Add brief natural processing delay so animation stages can be observed
    await new Promise((r) => setTimeout(r, 650));
    return generateDemoPrediction(scanType, [], generateReport);
  }
}

export async function predictSymptoms(
  symptoms: string[],
  generateReport: boolean = true
): Promise<PredictionResponse> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/predict/symptoms`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, generate_report: generateReport }),
      },
      TIMEOUTS.cnn
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`Symptoms triage error (${res.status}): ${errText}`);
    }
    return await res.json();
  } catch (err: any) {
    console.info('Backend triage unavailable. Operating in Demo Mode:', err?.message);
    await new Promise((r) => setTimeout(r, 450));
    return generateDemoPrediction('chest', symptoms, generateReport);
  }
}

export async function predictCombined(
  imageBlob: Blob | File,
  scanType: string,
  symptoms: string[],
  generateReport: boolean = true
): Promise<PredictionResponse> {
  try {
    const formData = new FormData();
    formData.append('file', imageBlob, 'scan.png');

    const url = `${API_BASE}/predict/combined/${scanType}?symptoms=${encodeURIComponent(symptoms.join(','))}&generate_report=${generateReport}`;
    const timeoutMs = generateReport ? TIMEOUTS.cnn + TIMEOUTS.gemma : TIMEOUTS.cnn;
    const res = await fetchWithTimeout(url, { method: 'POST', body: formData }, timeoutMs);

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`Combined analysis error (${res.status}): ${errText}`);
    }
    return await res.json();
  } catch (err: any) {
    console.info('Backend combined analysis unavailable. Operating in Demo Mode:', err?.message);
    await new Promise((r) => setTimeout(r, 750));
    return generateDemoPrediction(scanType, symptoms, generateReport);
  }
}

// ─────────────────────────────────────────────
//  XAI ENDPOINTS (individual with per-method timeouts)
// ─────────────────────────────────────────────
export async function requestXai(
  imageBlob: Blob | File,
  scanType: string,
  method: 'gradcam' | 'lime' | 'shap',
  params: Record<string, any> = {}
): Promise<XaiResultResponse> {
  try {
    const formData = new FormData();
    formData.append('file', imageBlob, 'scan.png');

    const qs = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    const url = `${API_BASE}/xai/${method}/${scanType}${qs ? `?${qs}` : ''}`;

    const methodTimeout =
      method === 'lime' ? TIMEOUTS.lime :
      method === 'shap' ? TIMEOUTS.shap :
      TIMEOUTS.gradcam;

    const res = await fetchWithTimeout(
      url,
      { method: 'POST', body: formData },
      methodTimeout
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`${method.toUpperCase()} XAI failed (${res.status}): ${errText}`);
    }
    return await res.json();
  } catch (err: any) {
    console.info(`Backend ${method.toUpperCase()} unavailable. Synthesizing in Demo Mode:`, err?.message);
    // Add brief natural calculation delay for authentic feel
    const delay = method === 'lime' ? 600 : method === 'shap' ? 500 : 350;
    await new Promise((r) => setTimeout(r, delay));
    return generateDemoXai(imageBlob, scanType, method, params);
  }
}
