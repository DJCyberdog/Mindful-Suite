import { getPreferences } from './preferences';
import type { SoundscapeDefinition } from './types';

let ctx: AudioContext | undefined;
let source: AudioBufferSourceNode | undefined;
let gainNode: GainNode | undefined;
let filterNode: BiquadFilterNode | undefined;
let currentId = 'none';
let baseGain = 0.2;

function ensureContext() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function makeNoiseBuffer(audioCtx: AudioContext, color: 'white' | 'pink' | 'brown' = 'pink') {
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
  const output = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < output.length; i++) {
    const white = Math.random() * 2 - 1;
    if (color === 'white') output[i] = white * 0.4;
    else if (color === 'brown') {
      lastOut = (lastOut + 0.02 * white) / 1.02;
      output[i] = lastOut * 3.2;
    } else {
      lastOut = 0.98 * lastOut + 0.02 * white;
      output[i] = (white * 0.3 + lastOut * 0.7) * 0.8;
    }
  }
  return buffer;
}

export function stopSoundscape() {
  source?.stop();
  source?.disconnect();
  source = undefined;
  currentId = 'none';
}

export async function applySoundscape(def: SoundscapeDefinition | undefined) {
  if (!def || def.type === 'none') {
    stopSoundscape();
    return;
  }

  const prefs = getPreferences();
  if (!prefs.soundscapeEnabled) return;

  if (currentId === def.id && source) return;
  stopSoundscape();

  const audioCtx = ensureContext();
  await audioCtx.resume();

  source = audioCtx.createBufferSource();
  source.buffer = makeNoiseBuffer(audioCtx, def.color ?? 'pink');
  source.loop = true;

  filterNode = audioCtx.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.value = def.lowpassHz ?? 800;

  gainNode = audioCtx.createGain();
  baseGain = def.gain ?? 0.2;
  gainNode.gain.value = baseGain * prefs.ambientVolume;

  source.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.start();
  currentId = def.id;
}

export function refreshSoundscapeVolume() {
  const prefs = getPreferences();
  if (gainNode) gainNode.gain.value = baseGain * prefs.ambientVolume;
}
