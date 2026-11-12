import { useSyncExternalStore } from 'react';
import type { Lang } from './useLang';

/**
 * All sound is made on the device: effects and music with Web Audio,
 * voice lines with the browser's own speech voices. No audio files, no network.
 * (Recorded ElevenLabs voice files can replace speak() later.)
 */

const KEY = 'hh-muted';
let muted = false;
try {
  muted = localStorage.getItem(KEY) === '1';
} catch {
  /* storage not available */
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicTimer: number | null = null;
const listeners = new Set<() => void>();

function ensure(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Call inside the first tap: browsers block sound before that. */
export function unlockAudio() {
  const c = ensure();
  if (c && c.state === 'suspended') void c.resume();
  startMusic();
}

export function isUnlocked() {
  return !!ctx && ctx.state === 'running';
}

function tone(freq: number, at: number, dur: number, vol = 0.18, type: OscillatorType = 'sine', slideTo?: number) {
  if (!ctx || !master || ctx.state !== 'running') return;
  const t0 = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/** Filtered noise, for running water. Returns a function that stops it early. */
function noise(dur: number, vol: number, freq: number): () => void {
  if (!ctx || !master || ctx.state !== 'running') return () => {};
  const t0 = ctx.currentTime;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = freq;
  band.Q.value = 0.7;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.3);
  g.gain.setValueAtTime(vol, t0 + dur - 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(band).connect(g).connect(master);
  src.start(t0);
  return () => {
    try {
      src.stop();
    } catch {
      /* already stopped */
    }
  };
}

export const sfx = {
  pop: () => tone(420, 0, 0.12, 0.25, 'sine', 980),
  tap: () => tone(660, 0, 0.06, 0.1, 'triangle'),
  good: () => {
    tone(660, 0, 0.16, 0.2);
    tone(990, 0.1, 0.25, 0.2);
  },
  /** Gentle "try again": soft and low, never scary. */
  soft: () => tone(330, 0, 0.22, 0.12, 'triangle', 262),
  flip: () => tone(520, 0, 0.05, 0.08, 'triangle', 700),
  whoosh: () => tone(200, 0, 0.3, 0.08, 'sine', 800),
  step: () => tone(170, 0, 0.05, 0.05, 'triangle', 120),
  tick: () => tone(880, 0, 0.09, 0.14, 'triangle'),
  click: () => tone(1500, 0, 0.03, 0.1, 'square'),
  drop: () => tone(190, 0, 0.2, 0.22, 'sine', 90),
  water: (seconds: number) => noise(seconds, 0.05, 2400),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.4, 0.2)),
};

/* A very soft, slow music loop. */
const SCALE = [262, 294, 330, 392, 440, 523, 587, 659];
const TUNE = [0, 2, 4, 5, 4, 2, 3, 1, 0, 2, 4, 7, 5, 4, 2, 1];
function startMusic() {
  if (musicTimer !== null) return;
  let step = 0;
  musicTimer = window.setInterval(() => {
    if (document.hidden) return;
    const n = TUNE[step % TUNE.length];
    tone(SCALE[n], 0, 1.1, 0.03);
    if (step % 4 === 0) tone(SCALE[n] / 2, 0, 1.8, 0.03);
    step++;
  }, 560);
}

/* ---------- voice ---------- */
/** Spoken voice is switched off: the games play only clicks, pops and chimes.
    Set to true to bring the device voice back. */
const VOICE_ENABLED = false;

export function speak(text: string, lang: Lang) {
  if (!VOICE_ENABLED || muted || !isUnlocked() || !('speechSynthesis' in window)) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
    if (voice) u.voice = voice;
    u.rate = 0.9;
    u.pitch = 1.1;
    synth.speak(u);
  } catch {
    /* no voice on this device */
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}

/* ---------- mute ---------- */
export function setMuted(m: boolean) {
  muted = m;
  if (master) master.gain.value = m ? 0 : 1;
  if (m) stopSpeaking();
  try {
    localStorage.setItem(KEY, m ? '1' : '0');
  } catch {
    /* storage not available */
  }
  listeners.forEach((l) => l());
}

export function useMuted() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => muted,
  );
}
