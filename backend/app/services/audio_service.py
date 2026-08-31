"""
Heuristic spectral-artifact scanner for WAV audio.

There is no dedicated audio deepfake/voice-cloning classifier configured in
this project (see backend/MODEL_SELECTION.md). Rather than fabricate a
confident ML verdict, this module runs a deterministic signal-processing
scan over the raw waveform and flags a small set of well-known synthesis
artifacts:

  - frequency_cutoff: an abrupt absence of energy above a frequency band
    that a natural recording at this sample rate would normally contain.
    Common when audio was upsampled from a lower-bitrate vocoder output.
  - robotic_artifacts: sustained high spectral flatness (noise-like,
    "flat" spectrum) during voiced/energetic segments, a common signature
    of some neural vocoders.

Results are explicitly labelled as heuristic in the API response and
capped to a moderate confidence range — this should never be presented to
end users as a certified deepfake-audio verdict.
"""

import wave
from io import BytesIO

import numpy as np

FREQUENCY_CUTOFF_HZ = 7000.0
FREQUENCY_CUTOFF_ENERGY_RATIO = 0.01
FLATNESS_THRESHOLD = 0.4
SILENCE_RMS_THRESHOLD = 0.01
WINDOW_SECONDS = 1.0
HOP_SECONDS = 0.5
MAX_WINDOWS = 40  # bound compute time for long files


class AudioDecodeError(ValueError):
    pass


def decode_wav(contents: bytes) -> tuple[np.ndarray, int]:
    """Decode a WAV file into mono float32 samples in [-1, 1] plus sample rate."""
    try:
        with wave.open(BytesIO(contents), 'rb') as wav_file:
            channels = wav_file.getnchannels()
            sample_width = wav_file.getsampwidth()
            sample_rate = wav_file.getframerate()
            raw_frames = wav_file.readframes(wav_file.getnframes())
    except (wave.Error, EOFError) as exc:
        raise AudioDecodeError(
            'The uploaded file is not a readable WAV file. Convert it to PCM WAV before uploading.'
        ) from exc

    if sample_width not in (1, 2, 4):
        raise AudioDecodeError('Only 8-bit, 16-bit, or 32-bit PCM WAV files are supported.')
    if not raw_frames:
        raise AudioDecodeError('The WAV file contains no audio data.')

    dtype = {1: np.uint8, 2: np.int16, 4: np.int32}[sample_width]
    samples = np.frombuffer(raw_frames, dtype=dtype).astype(np.float32)

    if sample_width == 1:
        samples = (samples - 128.0) / 128.0
    else:
        max_value = float(2 ** (sample_width * 8 - 1))
        samples = samples / max_value

    if channels > 1:
        samples = samples.reshape(-1, channels).mean(axis=1)

    return samples, sample_rate


def analyze_spectral_artifacts(samples: np.ndarray, sample_rate: int) -> tuple[float, list[dict]]:
    """Returns (heuristic_deepfake_probability, spectral_anomalies)."""
    window_size = max(1, int(WINDOW_SECONDS * sample_rate))
    hop_size = max(1, int(HOP_SECONDS * sample_rate))
    window_fn = np.hanning(window_size)
    freqs = np.fft.rfftfreq(window_size, d=1.0 / sample_rate)
    cutoff_bin = int(np.searchsorted(freqs, FREQUENCY_CUTOFF_HZ))

    anomalies: list[dict] = []
    flagged_windows = 0
    evaluated_windows = 0

    starts = list(range(0, max(1, len(samples) - window_size), hop_size))[:MAX_WINDOWS]
    if not starts:
        starts = [0]

    for start in starts:
        segment = samples[start:start + window_size]
        if len(segment) < window_size:
            segment = np.pad(segment, (0, window_size - len(segment)))

        rms = float(np.sqrt(np.mean(segment ** 2)))
        if rms < SILENCE_RMS_THRESHOLD:
            continue  # skip near-silent windows; no meaningful spectrum to judge

        evaluated_windows += 1
        spectrum = np.abs(np.fft.rfft(segment * window_fn)) + 1e-12
        total_energy = float(spectrum.sum())
        high_freq_energy = float(spectrum[cutoff_bin:].sum())
        high_freq_ratio = high_freq_energy / total_energy if total_energy > 0 else 0.0

        geometric_mean = float(np.exp(np.mean(np.log(spectrum))))
        arithmetic_mean = float(np.mean(spectrum))
        spectral_flatness = geometric_mean / arithmetic_mean if arithmetic_mean > 0 else 0.0

        time_start = start / sample_rate
        time_end = (start + window_size) / sample_rate
        window_flagged = False

        if sample_rate >= 16000 and high_freq_ratio < FREQUENCY_CUTOFF_ENERGY_RATIO:
            window_flagged = True
            anomalies.append({
                'timeStart': round(time_start, 2),
                'timeEnd': round(time_end, 2),
                'frequencyBand': f'{FREQUENCY_CUTOFF_HZ / 1000:.1f}kHz - {sample_rate / 2000:.1f}kHz',
                'anomalyScore': round(min(0.9, 1.0 - high_freq_ratio * 50), 4),
                'description': 'Abrupt high-frequency rolloff, consistent with a low-bitrate vocoder '
                               'or upsampled synthetic source rather than a natural microphone recording.',
                'type': 'frequency_cutoff',
            })

        if spectral_flatness > FLATNESS_THRESHOLD:
            window_flagged = True
            anomalies.append({
                'timeStart': round(time_start, 2),
                'timeEnd': round(time_end, 2),
                'frequencyBand': f'0kHz - {sample_rate / 2000:.1f}kHz',
                'anomalyScore': round(min(0.85, spectral_flatness), 4),
                'description': 'Sustained noise-like, flat spectral envelope during an energetic segment, '
                               'a pattern sometimes left by neural vocoder synthesis.',
                'type': 'robotic_artifacts',
            })

        if window_flagged:
            flagged_windows += 1

    if evaluated_windows == 0:
        return 0.0, []

    flagged_ratio = flagged_windows / evaluated_windows
    heuristic_probability = round(min(0.75, flagged_ratio * 0.9), 4)

    return heuristic_probability, anomalies