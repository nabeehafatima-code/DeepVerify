import { 
  VerificationReport, 
  MediaType, 
  FilterOptions, 
  StatsSummary, 
  AnalysisProgressEvent 
} from '../types';

const STORAGE_KEY = 'deepverify_reports_v1';

// Initial realistic mock reports for SIH demonstration
const DEFAULT_REPORTS: VerificationReport[] = [
  {
    verificationId: 'DV-2026-00124',
    filename: 'synthetic-portrait-candidate.jpg',
    fileSize: '3.4 MB',
    fileSizeBytes: 3565158,
    fileType: 'image/jpeg',
    mediaType: 'image',
    prediction: 'deepfake',
    deepfakeProbability: 0.974,
    authenticProbability: 0.026,
    confidence: 0.974,
    riskLevel: 'high',
    explanation: [
      'Facial boundary blending inconsistency detected around jawline and hairline',
      'Texture anomaly detected in cornea reflections (asymmetric specular highlights)',
      'High-frequency GAN artifact grid pattern identified in spatial domain analysis',
      'Sub-surface scattering irregularities across skin pores'
    ],
    detailedFindings: [
      {
        id: 'df-1',
        title: 'Asymmetric Ocular Reflections',
        description: 'Corneal light catch points show conflicting light source vectors (Left: 42° vs Right: 118°), indicative of StyleGAN synthetic synthesis.',
        score: 96,
        severity: 'high',
        category: 'visual'
      },
      {
        id: 'df-2',
        title: 'Boundary Gradient Dissimilarity',
        description: 'Laplacian filter shows unnatural pixel gradient variance along the neck/collar interface.',
        score: 89,
        severity: 'high',
        category: 'visual'
      },
      {
        id: 'df-3',
        title: 'Frequency Spectrum Peaks',
        description: 'FFT (Fast Fourier Transform) 2D power spectrum exhibits periodic checkerboard artifacts characteristic of transposed convolution layers.',
        score: 94,
        severity: 'high',
        category: 'spectral'
      },
      {
        id: 'df-4',
        title: 'Metadata Integrity Check',
        description: 'Missing standard EXIF hardware tags (Camera Model, Exposure Time, Lens Serial Number); contains synthetic signature remnants.',
        score: 72,
        severity: 'medium',
        category: 'metadata'
      }
    ],
    suspiciousRegions: [
      {
        id: 'sr-1',
        type: 'Ocular Inconsistency',
        box: { x: 34, y: 32, width: 32, height: 14 },
        confidence: 0.96,
        label: 'Irregular Iris Reflection',
        description: 'Specular reflection angles do not match ambient environmental lighting vectors.'
      },
      {
        id: 'sr-2',
        type: 'Facial Boundary Blending',
        box: { x: 26, y: 55, width: 48, height: 28 },
        confidence: 0.91,
        label: 'Edge Discontinuity',
        description: 'Unnatural smoothing filter residuals detected along jawline boundary.'
      },
      {
        id: 'sr-3',
        type: 'Ear Texture Artifact',
        box: { x: 20, y: 40, width: 12, height: 20 },
        confidence: 0.84,
        label: 'Morphed Cartilage Structure',
        description: 'Anomalous structural blurring common in generative diffusion models.'
      }
    ],
    timestamp: '2026-08-21T07:15:32.000Z',
    modelVersion: 'DeepVerify-Vision-X v2.4',
    modelDetails: {
      name: 'ResNeXt-50 + Spatial Artifact Attention Network',
      architecture: 'Dual-Stream Spatio-Temporal Transformer',
      modelVersion: 'v2.4.1-prod',
      latencyMs: 382,
      sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      datasetTrained: 'FaceForensics++, Celeb-DF v2, DeepFake Detection Challenge (DFDC)'
    },
    resolution: '2048 x 2048 px',
    mediaPreviewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    status: 'completed'
  },
  {
    verificationId: 'DV-2026-00125',
    filename: 'executive-briefing-statement.mp4',
    fileSize: '18.6 MB',
    fileSizeBytes: 19503513,
    fileType: 'video/mp4',
    mediaType: 'video',
    prediction: 'deepfake',
    deepfakeProbability: 0.942,
    authenticProbability: 0.058,
    confidence: 0.942,
    riskLevel: 'high',
    explanation: [
      'Temporal frame flickering identified between frame indices #142 - #198',
      'Lip-sync phoneme-viseme temporal offset (>120ms mismatch)',
      'Blinking pattern anomaly: 0 blinks detected over 42 continuous seconds of speech',
      'Warping artifacts around mouth and nasal cavity during fast head rotations'
    ],
    detailedFindings: [
      {
        id: 'vf-1',
        title: 'Phoneme-to-Viseme Desynchronization',
        description: 'Audio speech phonemes /b/, /m/, /p/ do not coincide with expected bilabial mouth closures.',
        score: 95,
        severity: 'high',
        category: 'temporal'
      },
      {
        id: 'vf-2',
        title: 'Spontaneous Blinking Deficit',
        description: 'Normal adult spontaneous blink rate is 12-20 blinks/min. Subject had 0 blinks over 42.5 seconds.',
        score: 91,
        severity: 'high',
        category: 'biometric'
      },
      {
        id: 'vf-3',
        title: 'Head Pose Transformation Residuals',
        description: '3D facial landmarks jitter anomalously during yaw rotation between seconds 00:08 and 00:14.',
        score: 88,
        severity: 'high',
        category: 'temporal'
      }
    ],
    frameAnalyses: [
      { frameNumber: 30, timestamp: 1.0, timestampFormatted: '00:01.0', confidence: 0.62, deepfakeScore: 0.22, isSuspicious: false },
      { frameNumber: 90, timestamp: 3.0, timestampFormatted: '00:03.0', confidence: 0.74, deepfakeScore: 0.35, isSuspicious: false },
      { frameNumber: 150, timestamp: 5.0, timestampFormatted: '00:05.0', confidence: 0.93, deepfakeScore: 0.89, isSuspicious: true, anomalyType: 'Lip Viseme Warping' },
      { frameNumber: 210, timestamp: 7.0, timestampFormatted: '00:07.0', confidence: 0.96, deepfakeScore: 0.95, isSuspicious: true, anomalyType: 'Facial Boundary Flicker' },
      { frameNumber: 270, timestamp: 9.0, timestampFormatted: '00:09.0', confidence: 0.98, deepfakeScore: 0.97, isSuspicious: true, anomalyType: 'Pose Landmark Jitter' },
      { frameNumber: 330, timestamp: 11.0, timestampFormatted: '00:11.0', confidence: 0.94, deepfakeScore: 0.91, isSuspicious: true, anomalyType: 'Specular Discontinuity' },
      { frameNumber: 390, timestamp: 13.0, timestampFormatted: '00:13.0', confidence: 0.85, deepfakeScore: 0.78, isSuspicious: true, anomalyType: 'Texture Smearing' },
      { frameNumber: 450, timestamp: 15.0, timestampFormatted: '00:15.0', confidence: 0.70, deepfakeScore: 0.41, isSuspicious: false }
    ],
    timestamp: '2026-08-21T06:40:10.000Z',
    modelVersion: 'DeepVerify-TemporalGuard v3.1',
    modelDetails: {
      name: '3D-CNN + Temporal Bi-LSTM Attention Engine',
      architecture: 'TimeSformer + Audio-Visual Cross-Modal Fusion',
      modelVersion: 'v3.1.0-prod',
      latencyMs: 1420,
      sha256Checksum: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      datasetTrained: 'DFDC, WildDeepfake, InTheWild Video Corpus'
    },
    duration: '00:32',
    resolution: '1920 x 1080 (30fps)',
    mediaPreviewUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    status: 'completed'
  },
  {
    verificationId: 'DV-2026-00126',
    filename: 'official-press-briefing-authentic.jpg',
    fileSize: '4.8 MB',
    fileSizeBytes: 5033164,
    fileType: 'image/jpeg',
    mediaType: 'image',
    prediction: 'authentic',
    deepfakeProbability: 0.038,
    authenticProbability: 0.962,
    confidence: 0.962,
    riskLevel: 'low',
    explanation: [
      'Natural optical bokeh & depth-of-field gradients consistent with physical 50mm f/1.8 lens',
      'Consistent multi-directional ambient lighting with verified shadow drop geometry',
      'Uniform Bayer pattern sensor noise across all color channels',
      'Intact photographic EXIF metadata matching Nikon Z9 hardware specifications'
    ],
    detailedFindings: [
      {
        id: 'af-1',
        title: 'Consistent Sensor Noise Residuals (PRNU)',
        description: 'Photo-Response Non-Uniformity analysis confirms single camera sensor origin without spliced regions.',
        score: 12,
        severity: 'low',
        category: 'visual'
      },
      {
        id: 'af-2',
        title: 'Authentic Skin Micro-Textures',
        description: 'Natural epidermal pore distribution and subtle blood perfusion gradients present.',
        score: 8,
        severity: 'low',
        category: 'biometric'
      },
      {
        id: 'af-3',
        title: 'EXIF Metadata Verified',
        description: 'Complete unbroken metadata history including shutter speed, ISO 400, focal length 50mm.',
        score: 5,
        severity: 'low',
        category: 'metadata'
      }
    ],
    timestamp: '2026-08-20T19:22:15.000Z',
    modelVersion: 'DeepVerify-Vision-X v2.4',
    modelDetails: {
      name: 'ResNeXt-50 + Spatial Artifact Attention Network',
      architecture: 'Dual-Stream Spatio-Temporal Transformer',
      modelVersion: 'v2.4.1-prod',
      latencyMs: 298,
      sha256Checksum: 'a8b1c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b112',
      datasetTrained: 'FaceForensics++, NIST Media Forensics, RealFace Benchmark'
    },
    resolution: '3840 x 2160 px',
    mediaPreviewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    status: 'completed'
  },
  {
    verificationId: 'DV-2026-00127',
    filename: 'voice-authorization-sample.wav',
    fileSize: '1.2 MB',
    fileSizeBytes: 1258291,
    fileType: 'audio/wav',
    mediaType: 'audio',
    prediction: 'deepfake',
    deepfakeProbability: 0.988,
    authenticProbability: 0.012,
    confidence: 0.988,
    riskLevel: 'high',
    explanation: [
      'Synthetic neural vocoder acoustic footprint detected (HiFi-GAN / WaveGlow signature)',
      'Unnatural spectral energy cutoff at 7.8 kHz indicating model upsampling limitation',
      'Robotic pitch stability with zero natural vocal fry or micro-tremor variance',
      'Phase incoherence across formant frequency transitions'
    ],
    detailedFindings: [
      {
        id: 'aud-1',
        title: 'Neural Vocoder Phase Discontinuity',
        description: 'Short-time Fourier transform (STFT) shows phase discontinuity at pitch transition points.',
        score: 98,
        severity: 'high',
        category: 'spectral'
      },
      {
        id: 'aud-2',
        title: 'Linear Frequency Spectrum Ceiling',
        description: 'Sharp drop off in spectral power density above 8,000 Hz, typical of 16kHz base models upsampled.',
        score: 94,
        severity: 'high',
        category: 'spectral'
      },
      {
        id: 'aud-3',
        title: 'Atypical Fundamental Frequency (F0) Flatness',
        description: 'Fundamental frequency variance is 64% lower than human physiological baseline speech.',
        score: 92,
        severity: 'high',
        category: 'biometric'
      }
    ],
    spectralAnomalies: [
      {
        timeStart: 1.2,
        timeEnd: 2.8,
        frequencyBand: '4.5 kHz - 8.0 kHz',
        anomalyScore: 0.96,
        description: 'Harmonic distortion & synthetic phase mismatch during sustained vowel /a:/',
        type: 'synthetic_vocoder'
      },
      {
        timeStart: 4.1,
        timeEnd: 5.6,
        frequencyBand: '7.8 kHz - 12.0 kHz',
        anomalyScore: 0.92,
        description: 'Abrupt spectral energy drop-off and artificial noise floor substitution',
        type: 'frequency_cutoff'
      }
    ],
    timestamp: '2026-08-20T14:05:44.000Z',
    modelVersion: 'DeepVerify-AcousticSentinel v1.8',
    modelDetails: {
      name: 'RawNet3 + LFCC-GMM Acoustic Verification Engine',
      architecture: 'Self-Supervised Audio SincNet + Conformer',
      modelVersion: 'v1.8.4-prod',
      latencyMs: 215,
      sha256Checksum: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      datasetTrained: 'ASVspoof 2019/2021, In-the-Wild Audio Deepfake Corpus'
    },
    duration: '00:18',
    sampleRate: '44.1 kHz, 16-bit Mono',
    status: 'completed'
  },
  {
    verificationId: 'DV-2026-00128',
    filename: 'podcast-guest-interview-mic1.mp3',
    fileSize: '5.6 MB',
    fileSizeBytes: 5872025,
    fileType: 'audio/mpeg',
    mediaType: 'audio',
    prediction: 'authentic',
    deepfakeProbability: 0.052,
    authenticProbability: 0.948,
    confidence: 0.948,
    riskLevel: 'low',
    explanation: [
      'Natural glottal pulse flow and authentic vocal tract resonance harmonics',
      'Realistic micro-tremor pitch perturbations characteristic of human vocal cords',
      'Continuous room acoustic reverb decay matching physical cardioid microphone response',
      'Full-spectrum acoustic fidelity across 20 Hz – 20 kHz with no synthetic cutoff'
    ],
    detailedFindings: [
      {
        id: 'aud-a1',
        title: 'Authentic Vocal Cord Jitter & Shimmer',
        description: 'Micro-variations in period length (jitter: 0.82%) and amplitude (shimmer: 2.1%) reflect human physiological phonation.',
        score: 8,
        severity: 'low',
        category: 'biometric'
      },
      {
        id: 'aud-a2',
        title: 'Continuous Room Impulse Response',
        description: 'Early reflections and RT60 reverberation profile (0.34s) are physically consistent across dialogue.',
        score: 6,
        severity: 'low',
        category: 'spectral'
      }
    ],
    timestamp: '2026-08-19T11:18:02.000Z',
    modelVersion: 'DeepVerify-AcousticSentinel v1.8',
    modelDetails: {
      name: 'RawNet3 + LFCC-GMM Acoustic Verification Engine',
      architecture: 'Self-Supervised Audio SincNet + Conformer',
      modelVersion: 'v1.8.4-prod',
      latencyMs: 198,
      sha256Checksum: '1b4f0e9851971998e732078544c6183f',
      datasetTrained: 'ASVspoof 2021, LibriSpeech, VoxCeleb'
    },
    duration: '01:45',
    sampleRate: '48.0 kHz, 320 kbps MP3',
    status: 'completed'
  }
];

// Helper to get all reports from local storage or defaults
function loadReports(): VerificationReport[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REPORTS));
      return DEFAULT_REPORTS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_REPORTS;
  }
}

function saveReports(reports: VerificationReport[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Failed to save reports in storage:', err);
  }
}

// Preset samples for fast demonstration during hackathon presentation
export interface DemoPreset {
  id: string;
  name: string;
  mediaType: MediaType;
  tag: string;
  expectedResult: 'deepfake' | 'authentic';
  previewUrl: string;
  description: string;
  duration?: string;
  fileSize: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'preset-img-deepfake',
    name: 'GAN Generated Face Swap',
    mediaType: 'image',
    tag: 'Synthetic Face',
    expectedResult: 'deepfake',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: 'StyleGAN3 generated face with asymmetric iris reflections and boundary smoothing.',
    fileSize: '3.2 MB'
  },
  {
    id: 'preset-img-authentic',
    name: 'Verified Portrait Photo',
    mediaType: 'image',
    tag: 'Natural Camera Capture',
    expectedResult: 'authentic',
    previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    description: 'Uncompressed raw capture with natural depth-of-field and unbroken EXIF tags.',
    fileSize: '4.8 MB'
  },
  {
    id: 'preset-video-deepfake',
    name: 'Manipulated Speech Video',
    mediaType: 'video',
    tag: 'Lip-Sync Swap',
    expectedResult: 'deepfake',
    previewUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    description: 'AI reenactment video with temporal phoneme-viseme jitter and blink rate anomalies.',
    duration: '00:32',
    fileSize: '18.6 MB'
  },
  {
    id: 'preset-audio-deepfake',
    name: 'Neural Cloned Voice Clip',
    mediaType: 'audio',
    tag: 'Voice Clone',
    expectedResult: 'deepfake',
    previewUrl: '',
    description: 'Text-To-Speech voice clone exhibiting high-frequency phase cancellation above 8kHz.',
    duration: '00:18',
    fileSize: '1.2 MB'
  },
  {
    id: 'preset-audio-authentic',
    name: 'Broadcast Microphone Audio',
    mediaType: 'audio',
    tag: 'Real Studio Audio',
    expectedResult: 'authentic',
    previewUrl: '',
    description: 'Authentic studio speech with natural glottal pulses and physical room reverberation.',
    duration: '01:45',
    fileSize: '5.6 MB'
  }
];

export const mockApiService = {
  /**
   * Future FastAPI integration point:
   * Will call POST /api/analyze/{mediaType} with FormData
   */
  async analyzeMedia(
    file: File | { name: string; size: number; type: string; url?: string },
    mediaType: MediaType,
    onProgress?: (event: AnalysisProgressEvent) => void,
    forcePresetType?: 'deepfake' | 'authentic'
  ): Promise<VerificationReport> {
    const steps = [
      { name: 'Uploading & Hashing', telemetry: 'Calculating SHA-256 integrity hash and validating codec...' },
      { name: 'Preprocessing & Decompression', telemetry: 'Extracting metadata, color spaces, and frequency transforms...' },
      { name: 'AI Deepfake Model Analysis', telemetry: 'Running spatial-temporal attention neural networks across media layers...' },
      { name: 'Explainability & Grad-CAM Mapping', telemetry: 'Computing attention heatmaps, landmark consistency, and spectral bounds...' },
      { name: 'Confidence & Risk Assessment', telemetry: 'Calibrating multi-model ensemble probabilities and uncertainty metrics...' },
      { name: 'Generating Verification Certificate', telemetry: 'Signing report metadata and assembling cryptographic proof...' }
    ];

    // Simulate realistic asynchronous progress telemetry
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const percent = Math.round(((i + 1) / steps.length) * 100);
      
      if (onProgress) {
        onProgress({
          stepIndex: i + 1,
          totalSteps: steps.length,
          stepName: step.name,
          progressPercent: percent,
          telemetryMessage: step.telemetry
        });
      }

      // Small randomized delay per step to simulate actual neural model processing
      await new Promise(resolve => setTimeout(resolve, 550 + Math.random() * 300));
    }

    // Determine prediction
    let isDeepfake = true;
    if (forcePresetType) {
      isDeepfake = forcePresetType === 'deepfake';
    } else {
      const lowerName = file.name.toLowerCase();
      if (lowerName.includes('real') || lowerName.includes('auth') || lowerName.includes('original') || lowerName.includes('podcast')) {
        isDeepfake = false;
      } else if (lowerName.includes('fake') || lowerName.includes('deep') || lowerName.includes('synth') || lowerName.includes('clone')) {
        isDeepfake = true;
      } else {
        // Pseudo-random deterministic based on file size
        isDeepfake = (file.size % 2 === 0);
      }
    }

    const probValue = isDeepfake 
      ? 0.90 + Math.random() * 0.08 
      : 0.02 + Math.random() * 0.06;
    
    const confidence = isDeepfake ? probValue : (1 - probValue);
    const riskLevel = isDeepfake ? (probValue > 0.85 ? 'high' : 'medium') : 'low';
    const reportId = `DV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    // Generate tailored explanation based on mediaType & result
    let explanation: string[] = [];
    let detailedFindings = [];
    let suspiciousRegions = undefined;
    let frameAnalyses = undefined;
    let spectralAnomalies = undefined;

    if (mediaType === 'image') {
      if (isDeepfake) {
        explanation = [
          'Facial boundary blending inconsistency detected around jawline and hairline',
          'Texture anomaly detected in cornea reflections (asymmetric specular highlights)',
          'High-frequency GAN artifact grid pattern identified in spatial domain analysis',
          'Sub-surface scattering irregularities across skin pores'
        ];
        detailedFindings = [
          {
            id: 'f-1',
            title: 'Asymmetric Ocular Specularity',
            description: 'Eye reflections show divergent light angle vectors inconsistent with environmental scene lighting.',
            score: 95,
            severity: 'high' as const,
            category: 'visual' as const
          },
          {
            id: 'f-2',
            title: 'Diffusion Boundary Dissimilarity',
            description: 'High-pass filter highlights unnatural edge blurring along jawline and hair boundaries.',
            score: 91,
            severity: 'high' as const,
            category: 'visual' as const
          },
          {
            id: 'f-3',
            title: 'Fourier Spectral Fingerprint',
            description: '2D-FFT reveals characteristic periodic frequency spikes indicative of neural upsampling layers.',
            score: 88,
            severity: 'high' as const,
            category: 'spectral' as const
          }
        ];
        suspiciousRegions = [
          {
            id: 'sr-1',
            type: 'Ocular Inconsistency',
            box: { x: 32, y: 30, width: 36, height: 16 },
            confidence: 0.95,
            label: 'Asymmetric Cornea Reflection',
            description: 'Light vectors diverge between left and right eyes.'
          },
          {
            id: 'sr-2',
            type: 'Boundary Blending',
            box: { x: 24, y: 52, width: 52, height: 32 },
            confidence: 0.89,
            label: 'Facial Seam Artefact',
            description: 'Residual pixel smoothing detected at jawline seam.'
          }
        ];
      } else {
        explanation = [
          'Natural optical depth-of-field gradients consistent with physical camera lens optics',
          'Uniform Bayer matrix sensor noise distribution across RGB channels',
          'Symmetric corneal light reflections verified with environmental point sources',
          'Intact camera hardware EXIF metadata and unbroken quantization table'
        ];
        detailedFindings = [
          {
            id: 'af-1',
            title: 'Sensor PRNU Fingerprint Match',
            description: 'Pixel response non-uniformity is homogeneous across entire frame.',
            score: 8,
            severity: 'low' as const,
            category: 'visual' as const
          },
          {
            id: 'af-2',
            title: 'Biometric Pore Microtexture',
            description: 'Organic skin porosity and natural subsurface illumination present.',
            score: 5,
            severity: 'low' as const,
            category: 'biometric' as const
          }
        ];
      }
    } else if (mediaType === 'video') {
      if (isDeepfake) {
        explanation = [
          'Temporal frame flickering and boundary shimmer identified across keyframes',
          'Lip-sync phoneme-viseme desynchronization with audio track (>110ms offset)',
          'Anomalous blink kinetics with unnatural inter-blink duration interval',
          '3D head pose warping residuals during angular yaw rotations'
        ];
        detailedFindings = [
          {
            id: 'vf-1',
            title: 'Audio-Visual Viseme Desync',
            description: 'Mouth movement kinetics do not match corresponding acoustic phonemes.',
            score: 94,
            severity: 'high' as const,
            category: 'temporal' as const
          },
          {
            id: 'vf-2',
            title: 'Biometric Eye-Blink Irregularity',
            description: 'Lack of spontaneous blinking over extended video duration.',
            score: 89,
            severity: 'high' as const,
            category: 'biometric' as const
          }
        ];
        frameAnalyses = [
          { frameNumber: 15, timestamp: 0.5, timestampFormatted: '00:00.5', confidence: 0.58, deepfakeScore: 0.20, isSuspicious: false },
          { frameNumber: 45, timestamp: 1.5, timestampFormatted: '00:01.5', confidence: 0.72, deepfakeScore: 0.38, isSuspicious: false },
          { frameNumber: 75, timestamp: 2.5, timestampFormatted: '00:02.5', confidence: 0.94, deepfakeScore: 0.92, isSuspicious: true, anomalyType: 'Lip Viseme Warping' },
          { frameNumber: 105, timestamp: 3.5, timestampFormatted: '00:03.5', confidence: 0.97, deepfakeScore: 0.96, isSuspicious: true, anomalyType: 'Facial Boundary Flicker' },
          { frameNumber: 135, timestamp: 4.5, timestampFormatted: '00:04.5', confidence: 0.95, deepfakeScore: 0.93, isSuspicious: true, anomalyType: 'Pose Landmark Jitter' },
          { frameNumber: 165, timestamp: 5.5, timestampFormatted: '00:05.5', confidence: 0.88, deepfakeScore: 0.81, isSuspicious: true, anomalyType: 'Specular Discontinuity' },
          { frameNumber: 195, timestamp: 6.5, timestampFormatted: '00:06.5', confidence: 0.65, deepfakeScore: 0.32, isSuspicious: false }
        ];
      } else {
        explanation = [
          'Consistent temporal landmark trajectories with natural physiological micro-movements',
          'Synchronous audio-visual phoneme-viseme correlation across all vocal utterances',
          'Natural spontaneous blink rate (16 blinks/min) with authentic eyelid closing curves',
          'Stable inter-frame lighting and zero spatial boundary seam artifacts'
        ];
        detailedFindings = [
          {
            id: 'avf-1',
            title: 'Continuous Frame Temporal Coherence',
            description: 'Optical flow vectors between adjacent video frames adhere to physical motion models.',
            score: 6,
            severity: 'low' as const,
            category: 'temporal' as const
          }
        ];
        frameAnalyses = [
          { frameNumber: 15, timestamp: 0.5, timestampFormatted: '00:00.5', confidence: 0.95, deepfakeScore: 0.05, isSuspicious: false },
          { frameNumber: 45, timestamp: 1.5, timestampFormatted: '00:01.5', confidence: 0.96, deepfakeScore: 0.04, isSuspicious: false },
          { frameNumber: 75, timestamp: 2.5, timestampFormatted: '00:02.5', confidence: 0.94, deepfakeScore: 0.06, isSuspicious: false },
          { frameNumber: 105, timestamp: 3.5, timestampFormatted: '00:03.5', confidence: 0.97, deepfakeScore: 0.03, isSuspicious: false }
        ];
      }
    } else {
      // Audio
      if (isDeepfake) {
        explanation = [
          'Synthetic neural vocoder acoustic footprint detected (HiFi-GAN / WaveGlow signature)',
          'Unnatural spectral energy cutoff above 7.8 kHz indicating base model upsampling ceiling',
          'Robotic pitch stability with missing natural vocal tract micro-tremor perturbations',
          'Phase incoherence across formant frequency transitions'
        ];
        detailedFindings = [
          {
            id: 'aud-f1',
            title: 'Neural Vocoder STFT Footprint',
            description: 'Phase alignment abnormalities found in spectrogram analysis.',
            score: 97,
            severity: 'high' as const,
            category: 'spectral' as const
          },
          {
            id: 'aud-f2',
            title: 'Linear Frequency Band Limitation',
            description: 'Spectrogram displays artificial noise substitution above 8,000 Hz.',
            score: 93,
            severity: 'high' as const,
            category: 'spectral' as const
          }
        ];
        spectralAnomalies = [
          {
            timeStart: 0.8,
            timeEnd: 2.4,
            frequencyBand: '4.5 kHz - 8.0 kHz',
            anomalyScore: 0.95,
            description: 'Harmonic distortion & synthetic phase mismatch',
            type: 'synthetic_vocoder' as const
          },
          {
            timeStart: 3.2,
            timeEnd: 4.6,
            frequencyBand: '7.8 kHz - 12.0 kHz',
            anomalyScore: 0.91,
            description: 'Artificial noise floor substitution & spectral ceiling',
            type: 'frequency_cutoff' as const
          }
        ];
      } else {
        explanation = [
          'Natural glottal pulse flow and authentic vocal tract resonance harmonics',
          'Realistic micro-tremor pitch perturbations characteristic of human vocal cords',
          'Continuous room acoustic reverberation decay matching physical microphone',
          'Full-spectrum acoustic fidelity across 20 Hz – 20 kHz with no synthetic cutoff'
        ];
        detailedFindings = [
          {
            id: 'aud-a1',
            title: 'Human Glottal Pulse Dynamics',
            description: 'Pitch jitter (0.78%) and shimmer (1.9%) are within normal human vocal range.',
            score: 7,
            severity: 'low' as const,
            category: 'biometric' as const
          }
        ];
      }
    }

    const previewUrl = 'url' in file && file.url 
      ? file.url 
      : (mediaType === 'image' 
          ? (isDeepfake ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80')
          : (mediaType === 'video' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' : undefined));

    const report: VerificationReport = {
      verificationId: reportId,
      filename: file.name,
      fileSize: sizeInMb,
      fileSizeBytes: file.size,
      fileType: file.type || `${mediaType}/standard`,
      mediaType,
      prediction: isDeepfake ? 'deepfake' : 'authentic',
      deepfakeProbability: isDeepfake ? probValue : (1 - confidence),
      authenticProbability: isDeepfake ? (1 - probValue) : confidence,
      confidence: Number(confidence.toFixed(3)),
      riskLevel,
      explanation,
      detailedFindings,
      suspiciousRegions,
      frameAnalyses,
      spectralAnomalies,
      timestamp: new Date().toISOString(),
      modelVersion: mediaType === 'image' ? 'DeepVerify-Vision-X v2.4' : (mediaType === 'video' ? 'DeepVerify-TemporalGuard v3.1' : 'DeepVerify-AcousticSentinel v1.8'),
      modelDetails: {
        name: mediaType === 'image' ? 'ResNeXt-50 + Spatial Artifact Attention Network' : (mediaType === 'video' ? '3D-CNN + Temporal Bi-LSTM Attention Engine' : 'RawNet3 + LFCC-GMM Acoustic Engine'),
        architecture: mediaType === 'image' ? 'Dual-Stream Spatio-Temporal Transformer' : (mediaType === 'video' ? 'TimeSformer + Cross-Modal Fusion' : 'Audio SincNet + Conformer'),
        modelVersion: 'v2.4.0-prod',
        latencyMs: Math.floor(250 + Math.random() * 400),
        sha256Checksum: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        datasetTrained: 'FaceForensics++, Celeb-DF v2, DFDC, ASVspoof 2021'
      },
      mediaPreviewUrl: previewUrl,
      duration: mediaType !== 'image' ? '00:24' : undefined,
      resolution: mediaType === 'image' ? '1920 x 1080 px' : (mediaType === 'video' ? '1920 x 1080 (30fps)' : undefined),
      sampleRate: mediaType === 'audio' ? '44.1 kHz, 16-bit' : undefined,
      status: 'completed'
    };

    // Save report to localStorage
    const existing = loadReports();
    saveReports([report, ...existing]);

    return report;
  },

  async getReports(filters?: FilterOptions): Promise<VerificationReport[]> {
    let reports = loadReports();

    if (!filters) return reports;

    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      reports = reports.filter(r => 
        r.filename.toLowerCase().includes(q) || 
        r.verificationId.toLowerCase().includes(q) ||
        r.explanation.some(e => e.toLowerCase().includes(q))
      );
    }

    if (filters.mediaType && filters.mediaType !== 'all') {
      reports = reports.filter(r => r.mediaType === filters.mediaType);
    }

    if (filters.prediction && filters.prediction !== 'all') {
      reports = reports.filter(r => r.prediction === filters.prediction);
    }

    if (filters.riskLevel && filters.riskLevel !== 'all') {
      reports = reports.filter(r => r.riskLevel === filters.riskLevel);
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'newest') {
        reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } else if (filters.sortBy === 'oldest') {
        reports.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      } else if (filters.sortBy === 'highest_confidence') {
        reports.sort((a, b) => b.confidence - a.confidence);
      } else if (filters.sortBy === 'lowest_confidence') {
        reports.sort((a, b) => a.confidence - b.confidence);
      }
    }

    return reports;
  },

  async getReportById(verificationId: string): Promise<VerificationReport | null> {
    const reports = loadReports();
    const found = reports.find(r => r.verificationId.toLowerCase() === verificationId.toLowerCase());
    return found || null;
  },

  async getStats(): Promise<StatsSummary> {
    const reports = loadReports();
    const total = reports.length;
    const deepfakes = reports.filter(r => r.prediction === 'deepfake').length;
    const authentic = reports.filter(r => r.prediction === 'authentic').length;
    const inconclusive = reports.filter(r => r.prediction === 'inconclusive').length;
    const avgConf = total > 0 
      ? reports.reduce((acc, curr) => acc + curr.confidence, 0) / total 
      : 0;

    return {
      totalAnalyses: total,
      deepfakesDetected: deepfakes,
      likelyAuthentic: authentic,
      inconclusiveCount: inconclusive,
      averageConfidence: Number(avgConf.toFixed(3)),
      imagesAnalyzed: reports.filter(r => r.mediaType === 'image').length,
      videosAnalyzed: reports.filter(r => r.mediaType === 'video').length,
      audiosAnalyzed: reports.filter(r => r.mediaType === 'audio').length
    };
  },

  async deleteReport(verificationId: string): Promise<void> {
    const reports = loadReports();
    const updated = reports.filter(r => r.verificationId !== verificationId);
    saveReports(updated);
  },

  async clearAllReports(): Promise<void> {
    saveReports([]);
  },

  async resetToDefaultReports(): Promise<VerificationReport[]> {
    saveReports(DEFAULT_REPORTS);
    return DEFAULT_REPORTS;
  },

  exportReportAsJson(report: VerificationReport) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DeepVerify_Report_${report.verificationId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  exportReportAsText(report: VerificationReport) {
    const textContent = `
================================================================================
                        DEEPVERIFY MEDIA VERIFICATION REPORT
================================================================================
Verification ID:    ${report.verificationId}
Generated Date:     ${new Date(report.timestamp).toUTCString()}
File Name:          ${report.filename}
File Size:          ${report.fileSize}
Media Type:         ${report.mediaType.toUpperCase()}
Status:             ${report.status.toUpperCase()}

--------------------------------------------------------------------------------
VERIFICATION ASSESSMENT
--------------------------------------------------------------------------------
Overall Prediction: ${report.prediction.toUpperCase() === 'DEEPFAKE' ? 'LIKELY DEEPFAKE / MANIPULATED' : 'LIKELY AUTHENTIC'}
Model Confidence:   ${(report.confidence * 100).toFixed(1)}%
Risk Level:         ${report.riskLevel.toUpperCase()}
Deepfake Prob:      ${(report.deepfakeProbability * 100).toFixed(1)}%
Authentic Prob:     ${(report.authenticProbability * 100).toFixed(1)}%

--------------------------------------------------------------------------------
EXPLANATION & DETECTED ARTIFACTS
--------------------------------------------------------------------------------
${report.explanation.map((exp, idx) => `[${idx + 1}] ${exp}`).join('\n')}

--------------------------------------------------------------------------------
MODEL & SYSTEM SPECIFICATIONS
--------------------------------------------------------------------------------
Model Name:         ${report.modelDetails.name}
Model Architecture: ${report.modelDetails.architecture}
Version:            ${report.modelVersion}
Inference Latency:  ${report.modelDetails.latencyMs} ms
SHA-256 Checksum:   ${report.modelDetails.sha256Checksum}
Datasets:           ${report.modelDetails.datasetTrained}

================================================================================
DISCLAIMER:
This result represents an AI model assessment and should not be treated as
absolute proof of authenticity. DeepVerify uses probabilistic deep neural
networks to evaluate media artifacts and statistical likelihoods.
================================================================================
    `.trim();

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DeepVerify_Report_${report.verificationId}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  async shareReport(report: VerificationReport): Promise<{ url: string; copied: boolean }> {
    const url = `${window.location.origin}/reports/${report.verificationId}`;
    let copied = false;

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `DeepVerify Report: ${report.filename}`,
          text: `Verification Result: ${report.prediction.toUpperCase()} (${(report.confidence * 100).toFixed(0)}% confidence). View official report:`,
          url
        });
      } catch {
        // User cancelled or share failed
      }
    }

    return { url, copied };
  }
};
