export type AppSound =
  | "open"
  | "select"
  | "submit"
  | "correct"
  | "incorrect"
  | "complete"
  | "reset"
  | "preset";

let audioContext: AudioContext | null = null;

export function prepareAppAudio(enabled: boolean): void {
  if (!enabled) return;

  const context = getAudioContext();
  if (!context || context.state !== "suspended") return;

  void context.resume();
}

export function playAppSound(sound: AppSound, enabled: boolean): void {
  if (!enabled) return;

  const context = getAudioContext();
  if (!context) return;

  if (context.state === "suspended") {
    void context.resume();
  }

  const now = context.currentTime + 0.01;

  switch (sound) {
    case "open":
      playTone(context, { frequency: 392, start: now, duration: 0.06, gain: 0.025 });
      playTone(context, { frequency: 523.25, start: now + 0.045, duration: 0.08, gain: 0.028 });
      break;
    case "select":
      playTone(context, { frequency: 440, start: now, duration: 0.045, gain: 0.018 });
      break;
    case "submit":
      playTone(context, { frequency: 330, start: now, duration: 0.045, gain: 0.02 });
      playTone(context, { frequency: 392, start: now + 0.035, duration: 0.045, gain: 0.018 });
      break;
    case "correct":
      playTone(context, { frequency: 523.25, start: now, duration: 0.08, gain: 0.035 });
      playTone(context, { frequency: 659.25, start: now + 0.065, duration: 0.1, gain: 0.035 });
      playTone(context, { frequency: 783.99, start: now + 0.13, duration: 0.13, gain: 0.03 });
      break;
    case "incorrect":
      playTone(context, {
        frequency: 196,
        endFrequency: 146.83,
        start: now,
        duration: 0.16,
        gain: 0.035,
        type: "sawtooth",
      });
      break;
    case "complete":
      playTone(context, { frequency: 392, start: now, duration: 0.11, gain: 0.036 });
      playTone(context, { frequency: 523.25, start: now + 0.08, duration: 0.13, gain: 0.036 });
      playTone(context, { frequency: 659.25, start: now + 0.16, duration: 0.16, gain: 0.034 });
      playTone(context, { frequency: 1046.5, start: now + 0.28, duration: 0.22, gain: 0.028 });
      break;
    case "reset":
      playTone(context, {
        frequency: 246.94,
        endFrequency: 164.81,
        start: now,
        duration: 0.18,
        gain: 0.028,
        type: "triangle",
      });
      break;
    case "preset":
      playTone(context, { frequency: 329.63, start: now, duration: 0.06, gain: 0.025 });
      playTone(context, { frequency: 493.88, start: now + 0.05, duration: 0.09, gain: 0.027 });
      break;
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (audioContext) return audioContext;

  const AudioContextCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextCtor) return null;

  audioContext = new AudioContextCtor();
  return audioContext;
}

function playTone(
  context: AudioContext,
  {
    frequency,
    endFrequency,
    start,
    duration,
    gain,
    type = "sine",
  }: {
    frequency: number;
    endFrequency?: number;
    start: number;
    duration: number;
    gain: number;
    type?: OscillatorType;
  },
): void {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  const attack = Math.min(0.012, duration / 3);
  const releaseStart = start + Math.max(attack, duration * 0.58);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(1, endFrequency),
      start + duration,
    );
  }

  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(gain, start + attack);
  envelope.gain.exponentialRampToValueAtTime(gain * 0.72, releaseStart);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(envelope);
  envelope.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}
