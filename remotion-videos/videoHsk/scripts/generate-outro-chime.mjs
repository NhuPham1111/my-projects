import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Generate a short, dependency-free major-key melody for the end card.
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputPath = path.join(
  projectRoot,
  "public",
  "audio",
  "sfx",
  "outro-follow-chime.wav",
);
const sampleRate = 44100;
const notes = [
  { frequency: 523.25, duration: 0.2 },
  { frequency: 659.25, duration: 0.2 },
  { frequency: 783.99, duration: 0.24 },
  { frequency: 1046.5, duration: 0.38 },
  { frequency: 880, duration: 0.18 },
  { frequency: 783.99, duration: 0.18 },
  { frequency: 659.25, duration: 0.2 },
  { frequency: 1046.5, duration: 0.52 },
];
const gap = 0.035;
const totalSeconds = notes.reduce((sum, note) => sum + note.duration, 0) + gap * 3;
const sampleCount = Math.ceil(totalSeconds * sampleRate);
const samples = new Float32Array(sampleCount);

let startSeconds = 0;
for (const note of notes) {
  const startSample = Math.floor(startSeconds * sampleRate);
  const noteSamples = Math.floor(note.duration * sampleRate);

  for (let i = 0; i < noteSamples; i++) {
    const time = i / sampleRate;
    const attack = Math.min(1, time / 0.012);
    const release = Math.min(1, (note.duration - time) / 0.08);
    const envelope = Math.max(0, Math.min(attack, release)) * Math.exp(-4.2 * time);
    const bellTone =
      Math.sin(2 * Math.PI * note.frequency * time) * 0.62 +
      Math.sin(2 * Math.PI * note.frequency * 2 * time) * 0.25 +
      Math.sin(2 * Math.PI * note.frequency * 3.01 * time) * 0.13;
    samples[startSample + i] += bellTone * envelope * 0.48;
  }

  startSeconds += note.duration + gap;
}

const pcmBytes = sampleCount * 2;
const wav = Buffer.alloc(44 + pcmBytes);
wav.write("RIFF", 0);
wav.writeUInt32LE(36 + pcmBytes, 4);
wav.write("WAVE", 8);
wav.write("fmt ", 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20); // PCM
wav.writeUInt16LE(1, 22); // Mono
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(pcmBytes, 40);

for (let i = 0; i < sampleCount; i++) {
  const sample = Math.max(-1, Math.min(1, samples[i]));
  wav.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
}

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, wav);
console.log(`Generated ${path.relative(projectRoot, outputPath)}`);
