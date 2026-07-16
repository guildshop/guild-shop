"use client";

/**
 * Tiny shared sound-effect engine. Synthesizes short UI sounds with the Web
 * Audio API so no audio files are needed. One AudioContext is shared across
 * all effects, and unlocked on the first user gesture (autoplay policy).
 */

let sharedCtx: AudioContext | null = null;

export function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedCtx) sharedCtx = new Ctor();
  if (sharedCtx.state === "suspended") sharedCtx.resume().catch(() => {});
  return sharedCtx;
}

let unlocked = false;
export function armAudioUnlock() {
  if (unlocked || typeof window === "undefined") return;
  unlocked = true;
  const unlock = () => getAudioCtx();
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

/** Short mechanical "clack" — used for the footer split-flap letters. */
export function playFlip() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const bufferSize = Math.floor(ctx.sampleRate * 0.045);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 1500 + Math.random() * 800;
  bandpass.Q.value = 1.1;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.16, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  noise.connect(bandpass).connect(gain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.06);
}

/**
 * Void-suction whoosh: filtered noise whose bandpass frequency and gain
 * sweep upward over `duration` seconds, like air rushing into a collapsing
 * point — for the portal-suck world transition.
 */
export function playVoidSuction(duration = 1.3) {
  const ctx = getAudioCtx();
  if (!ctx) return null;
  const now = ctx.currentTime;

  // Long looping noise source
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(220, now);
  filter.frequency.exponentialRampToValueAtTime(3400, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + duration * 0.65);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  // subtle pitch-rising drone underneath for "gravity" weight
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(60, now);
  osc.frequency.exponentialRampToValueAtTime(340, now + duration);
  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.0001, now);
  oscGain.gain.exponentialRampToValueAtTime(0.05, now + duration * 0.7);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(filter).connect(gain).connect(ctx.destination);
  osc.connect(oscGain).connect(ctx.destination);
  noise.start(now);
  osc.start(now);
  noise.stop(now + duration + 0.05);
  osc.stop(now + duration + 0.05);

  return { ctx, endsAt: now + duration };
}

/** Deep sub-bass "thump" for the portal collapsing / logo eruption moment. */
export function playVoidThump() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(38, now + 0.35);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);

  // a bright transient click on top so the thump reads as an "impact"
  const bufferSize = Math.floor(ctx.sampleRate * 0.02);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const click = ctx.createBufferSource();
  click.buffer = buffer;
  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.25, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  click.connect(clickGain).connect(ctx.destination);
  click.start(now);
}
